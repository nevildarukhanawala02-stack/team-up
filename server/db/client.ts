import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import { experiences } from "./schema";
import seedExperiencesData from "./seed-experiences.json";

if (!process.env.MYSQL_URL) {
  throw new Error("MYSQL_URL is not set. Add a MySQL database on Railway and link it to this service.");
}

const pool = mysql.createPool(process.env.MYSQL_URL);

export const db = drizzle(pool, { schema, mode: "default" });

/**
 * Creates the tables if they don't exist yet. Called once on server startup.
 * Simple, additive-only approach appropriate for this project's scale —
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
      highlights JSON,
      gallery JSON,
      proof VARCHAR(255),
      press_links JSON,
      story_link VARCHAR(128),
      image_placeholder BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await seedExperiencesIfEmpty();

  console.log("Database schema ready.");
}

/**
 * Populates the experiences table from the bundled seed JSON, but only if
 * the table is currently empty — this runs safely on every boot without
 * ever overwriting real admin edits made after the first deploy.
 */
async function seedExperiencesIfEmpty() {
  const existing = await db.select({ id: experiences.id }).from(experiences).limit(1);
  if (existing.length > 0) return;

  for (const item of seedExperiencesData) {
    await db.insert(experiences).values(item as typeof experiences.$inferInsert);
  }
  console.log(`Seeded ${seedExperiencesData.length} experiences.`);
}
