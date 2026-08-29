import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import * as schema from "./schema";
import { experiences, blogPosts } from "./schema";
import seedExperiencesData from "./seed-experiences.json";
import seedBlogPostsData from "./seed-blog-posts.json";

// Never throw at import time, a missing/misconfigured MYSQL_URL should
// degrade DB-backed routes gracefully (they already handle query errors),
// not crash the whole process before the static site can even serve.
// mysql2's createPool doesn't connect eagerly, so an unreachable/placeholder
// URL here is safe; only an actual query attempt will fail, inside the
// try/catch each route already has.
if (!process.env.MYSQL_URL) {
  console.error("MYSQL_URL is not set, DB-backed routes will fail until it's added on Railway.");
}
const connectionString = process.env.MYSQL_URL || "mysql://unset:unset@localhost:3306/unset";

const pool = mysql.createPool(connectionString);

export const db = drizzle(pool, { schema, mode: "default" });

/**
 * Creates the tables if they don't exist yet. Called once on server startup.
 * Simple, additive-only approach appropriate for this project's scale,
 * safe to run on every boot since CREATE TABLE IF NOT EXISTS is a no-op
 * once the tables already exist.
 */
export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      organization VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(64),
      message TEXT,
      source VARCHAR(64) NOT NULL,
      source_detail VARCHAR(255),
      metadata JSON,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      session_id VARCHAR(64) NOT NULL,
      event_type VARCHAR(64) NOT NULL,
      entity_id INT,
      entity_type VARCHAR(32),
      page_path VARCHAR(255),
      referrer VARCHAR(500),
      device_type VARCHAR(16),
      country VARCHAR(2),
      value INT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX analytics_events_event_type_created_at_idx (event_type, created_at),
      INDEX analytics_events_session_id_idx (session_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(128) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      hook TEXT NOT NULL,
      category VARCHAR(32) NOT NULL,
      format VARCHAR(32) NOT NULL,
      color VARCHAR(16) NOT NULL,
      is_real BOOLEAN NOT NULL DEFAULT FALSE,
      display_order INT NOT NULL DEFAULT 0,
      icon_name VARCHAR(64),
      image VARCHAR(500),
      image_alt VARCHAR(500),
      preview_description TEXT,
      preview_possible_elements JSON,
      hero_image VARCHAR(500),
      hero_alt VARCHAR(500),
      partner VARCHAR(255),
      story_direction TEXT,
      ceremony TEXT,
      impact TEXT,
      highlights JSON,
      gallery JSON,
      proof VARCHAR(255),
      press_links JSON,
      story_link VARCHAR(128),
      image_placeholder BOOLEAN DEFAULT FALSE,
      story_scene TEXT,
      story_narrative TEXT,
      story_moment TEXT,
      story_gallery_style VARCHAR(32),
      story_videos JSON,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(200) NOT NULL UNIQUE,
      title VARCHAR(300) NOT NULL,
      excerpt TEXT,
      cover_image VARCHAR(500),
      cover_image_alt VARCHAR(500),
      content TEXT NOT NULL,
      category VARCHAR(64),
      post_type VARCHAR(20) NOT NULL DEFAULT 'cluster_article',
      tags JSON,
      author VARCHAR(120),
      status VARCHAR(16) NOT NULL DEFAULT 'draft',
      published_at TIMESTAMP NULL,
      read_time_minutes INT,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX blog_posts_status_published_at_idx (status, published_at)
    )
  `);

  await addColumnIfMissing("experiences", "impact", "TEXT AFTER ceremony");
  await addColumnIfMissing("blog_posts", "post_type", "VARCHAR(20) NOT NULL DEFAULT 'cluster_article' AFTER category");
  await addColumnIfMissing("contact_submissions", "metadata", "JSON AFTER source_detail");
  await addColumnIfMissing("experiences", "story_scene", "TEXT AFTER story_link");
  await addColumnIfMissing("experiences", "story_narrative", "TEXT AFTER story_scene");
  await addColumnIfMissing("experiences", "story_moment", "TEXT AFTER story_narrative");
  await addColumnIfMissing("experiences", "story_gallery_style", "VARCHAR(32) AFTER story_moment");
  await addColumnIfMissing("experiences", "story_videos", "JSON AFTER story_gallery_style");
  await syncMissingExperiences();
  await syncMissingBlogPosts();
  await repairPlaceholderBlogCovers();
  await repairBlogPostTypes();
  await backfillMissingFields();

  console.log("Database schema ready.");
}

/**
 * Adds a column to an existing table if it isn't already there. Needed
 * because CREATE TABLE IF NOT EXISTS is a no-op on a table that already
 * exists in production, new columns added to the schema after first
 * deploy (like `impact`) never actually reach the live table without this.
 * MySQL's ADD COLUMN IF NOT EXISTS support varies by version, so this
 * catches the "duplicate column" error instead of relying on that syntax.
 */
async function addColumnIfMissing(table: string, column: string, definition: string) {
  try {
    await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`Added column ${table}.${column}.`);
  } catch (err: any) {
    if (err?.code !== "ER_DUP_FIELDNAME") throw err;
  }
}

/**
 * Backfills fields that are empty on already-existing rows but present in
 * the seed JSON, e.g. `impact`, added after the 3 real experiences were
 * already live. Only fills NULL/empty values; never overwrites a value
 * that's already set (including real admin edits), so it's safe on every
 * boot and idempotent once every row has the field populated.
 */
async function backfillMissingFields() {
  const existing = await db
    .select({
      slug: experiences.slug,
      impact: experiences.impact,
      storyScene: experiences.storyScene,
      storyNarrative: experiences.storyNarrative,
      storyMoment: experiences.storyMoment,
      storyGalleryStyle: experiences.storyGalleryStyle,
      storyVideos: experiences.storyVideos,
    })
    .from(experiences);
  const bySlug = new Map(existing.map((row) => [row.slug, row]));

  let backfilled = 0;
  for (const item of seedExperiencesData as Array<Record<string, unknown>>) {
    const row = bySlug.get(item.slug as string);
    if (!row) continue; // handled by syncMissingExperiences instead

    const patch: Partial<typeof experiences.$inferInsert> = {};
    if (!row.impact && item.impact) patch.impact = item.impact as string;
    if (!row.storyScene && item.storyScene) patch.storyScene = item.storyScene as string;
    if (!row.storyNarrative && item.storyNarrative) patch.storyNarrative = item.storyNarrative as string;
    if (!row.storyMoment && item.storyMoment) patch.storyMoment = item.storyMoment as string;
    if (!row.storyGalleryStyle && item.storyGalleryStyle) patch.storyGalleryStyle = item.storyGalleryStyle as string;
    if (!row.storyVideos && item.storyVideos) patch.storyVideos = item.storyVideos as { src: string; label: string }[];

    if (Object.keys(patch).length > 0) {
      await db.update(experiences).set(patch).where(eq(experiences.slug, item.slug as string));
      backfilled++;
    }
  }
  if (backfilled > 0) console.log(`Backfilled story fields on ${backfilled} existing row(s).`);
}

/**
 * Populates the experiences table from the bundled seed JSON, inserting only
 * slugs that don't already exist in the DB. This runs safely on every boot:
 * it never touches or overwrites rows that already exist (including real
 * admin edits made after launch), so it's safe even on a table that was
 * seeded long ago and has since had new entries added to the JSON file
 * (e.g. new concept experiences) that never made it into production.
 */
async function syncMissingExperiences() {
  const existing = await db.select({ slug: experiences.slug }).from(experiences);
  const existingSlugs = new Set(existing.map((row) => row.slug));

  const missing = seedExperiencesData.filter((item) => !existingSlugs.has(item.slug));
  if (missing.length === 0) return;

  for (const item of missing) {
    await db.insert(experiences).values(item as typeof experiences.$inferInsert);
  }
  console.log(`Synced ${missing.length} missing experience(s): ${missing.map((i) => i.slug).join(", ")}`);
}

/**
 * Same pattern as syncMissingExperiences: inserts only slugs that don't
 * already exist, never touches or overwrites rows already in the table
 * (including posts edited via /admin/blog after launch). Safe to add more
 * entries to seed-blog-posts.json later and redeploy, only the new ones
 * get inserted.
 */
async function syncMissingBlogPosts() {
  const existing = await db.select({ slug: blogPosts.slug }).from(blogPosts);
  const existingSlugs = new Set(existing.map((row) => row.slug));

  const missing = (seedBlogPostsData as Array<Record<string, unknown>>).filter(
    (item) => !existingSlugs.has(item.slug as string),
  );
  if (missing.length === 0) return;

  for (const item of missing) {
    await db.insert(blogPosts).values({
      ...(item as typeof blogPosts.$inferInsert),
      publishedAt: item.publishedAt ? new Date(item.publishedAt as string) : null,
    });
  }
  console.log(`Synced ${missing.length} missing blog post(s): ${missing.map((i) => i.slug).join(", ")}`);
}

/**
 * One-time repair for the 8 CSR pillar posts seeded before the header-card
 * design was reconsidered (a plain color-block image that looked fine as a
 * small thumbnail but read as a meaningless block on the full-width post
 * page). Clears coverImage/coverImageAlt ONLY when the row's current value
 * still exactly matches the placeholder path we originally set, so a post
 * where someone has since uploaded a real cover image via /admin/blog is
 * never touched. Safe to leave in permanently; once every matching row has
 * been cleared, later runs simply find nothing left to repair.
 */
async function repairPlaceholderBlogCovers() {
  let repaired = 0;
  for (const item of seedBlogPostsData as Array<Record<string, unknown>>) {
    const placeholderPath = `/images/blog/${item.slug}.png`;
    const result = await db
      .update(blogPosts)
      .set({ coverImage: null, coverImageAlt: null })
      .where(and(eq(blogPosts.slug, item.slug as string), eq(blogPosts.coverImage, placeholderPath)));
    if ((result as any)[0]?.affectedRows > 0) repaired++;
  }
  if (repaired > 0) console.log(`Repaired ${repaired} placeholder blog cover image(s).`);
}

/**
 * Same safe-repair pattern as repairPlaceholderBlogCovers: the post_type
 * column didn't exist when the CSR pillar posts were first seeded, so they
 * all defaulted to 'cluster_article'. This corrects the pillar guide and
 * FAQ hub specifically, but only while a row is still sitting at the
 * default value, so a postType someone's deliberately set via /admin/blog
 * (including setting it BACK to cluster_article on purpose) is never
 * overwritten.
 */
async function repairBlogPostTypes() {
  let repaired = 0;
  for (const item of seedBlogPostsData as Array<Record<string, unknown>>) {
    if (item.postType === "cluster_article") continue; // already the default, nothing to repair
    const result = await db
      .update(blogPosts)
      .set({ postType: item.postType as string })
      .where(and(eq(blogPosts.slug, item.slug as string), eq(blogPosts.postType, "cluster_article")));
    if ((result as any)[0]?.affectedRows > 0) repaired++;
  }
  if (repaired > 0) console.log(`Repaired ${repaired} blog post type(s).`);
}
