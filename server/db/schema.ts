import { mysqlTable, int, varchar, text, timestamp, boolean, json } from "drizzle-orm/mysql-core";

/**
 * The full experiences catalogue — real, delivered experiences and concept
 * ideas, in one table. `isReal` decides which set of fields matter:
 *  - isReal=true  -> heroImage/heroAlt/partner/storyDirection/ceremony/impact/
 *                    highlights/gallery/proof/pressLinks/storyLink are used.
 *                    storyDirection+ceremony = the Celebration half (§5A);
 *                    impact = what's still true after the day ends — never
 *                    a fabricated stat, only a real, verified outcome.
 *  - isReal=false -> iconName/image/imageAlt/previewDescription/
 *                    previewPossibleElements are used
 * Both share slug/name/hook/category/format/color/displayOrder.
 */
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  hook: text("hook").notNull(),
  category: varchar("category", { length: 32 }).notNull(),
  format: varchar("format", { length: 32 }).notNull(),
  color: varchar("color", { length: 16 }).notNull(),
  isReal: boolean("is_real").notNull().default(false),
  displayOrder: int("display_order").notNull().default(0),

  // Concept-only fields
  iconName: varchar("icon_name", { length: 64 }),
  image: varchar("image", { length: 500 }),
  imageAlt: varchar("image_alt", { length: 500 }),
  previewDescription: text("preview_description"),
  previewPossibleElements: json("preview_possible_elements").$type<string[]>(),

  // Real/delivered-only fields
  heroImage: varchar("hero_image", { length: 500 }),
  heroAlt: varchar("hero_alt", { length: 500 }),
  partner: varchar("partner", { length: 255 }),
  storyDirection: text("story_direction"),
  ceremony: text("ceremony"),
  impact: text("impact"),
  highlights: json("highlights").$type<string[]>(),
  gallery: json("gallery").$type<{ src: string; alt: string; caption: string }[]>(),
  proof: varchar("proof", { length: 255 }),
  pressLinks: json("press_links").$type<{ title: string; source: string; url: string }[]>(),
  storyLink: varchar("story_link", { length: 128 }),
  imagePlaceholder: boolean("image_placeholder").default(false),

  // Magazine-format fields — power the long-form /stories page. Only set on
  // isReal rows that have been written up for that treatment; a real
  // experience with no storyNarrative simply doesn't appear on /stories yet
  // (never fabricated to fill the slot). Reuses heroImage/heroAlt, gallery,
  // proof, and color (as the accent) from the fields above rather than
  // duplicating them.
  storyScene: text("story_scene"), // one-line scene-setter under the banner image
  storyNarrative: text("story_narrative"), // the full long-form narrative paragraph
  storyMoment: text("story_moment"), // short pull-quote for the closing "moment" panel
  storyGalleryStyle: varchar("story_gallery_style", { length: 32 }), // 'evidence' | 'timeline' | 'closeups' | 'festival'
  storyVideos: json("story_videos").$type<{ src: string; label: string }[]>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Blog posts. Rich content is authored as HTML from the TipTap editor in
 * /admin/blog. `status` gates public visibility — only 'published' rows with
 * a past/present `publishedAt` are ever returned from the public /api/blog
 * endpoints; drafts stay admin-only so a post can be written over time
 * without appearing on the site early.
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  excerpt: text("excerpt"),
  coverImage: varchar("cover_image", { length: 500 }),
  coverImageAlt: varchar("cover_image_alt", { length: 500 }),
  content: text("content").notNull(), // rich HTML from the TipTap editor
  category: varchar("category", { length: 64 }),
  tags: json("tags").$type<string[]>(),
  author: varchar("author", { length: 120 }),
  status: varchar("status", { length: 16 }).notNull().default("draft"), // 'draft' | 'published'
  publishedAt: timestamp("published_at"),
  readTimeMinutes: int("read_time_minutes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * A submission from any inquiry form on the site (Contact page, or any
 * per-experience "Send us an inquiry" form). One table, `source` tells you
 * which form it came from.
 */
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  message: text("message"),
  source: varchar("source", { length: 64 }).notNull(), // 'contact_page' | 'experience_inquiry'
  sourceDetail: varchar("source_detail", { length: 255 }), // e.g. the experience name, for experience_inquiry
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Generic site analytics events (page views, time-on-page, etc).
 * entityId/entityType stay generic on purpose — reuse the same table for
 * new event types by tagging a different entityType rather than adding
 * columns.
 */
export const analyticsEvents = mysqlTable("analytics_events", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  eventType: varchar("event_type", { length: 64 }).notNull(), // 'page_view' | 'page_time' | ...
  entityId: int("entity_id"),
  entityType: varchar("entity_type", { length: 32 }),
  pagePath: varchar("page_path", { length: 255 }),
  referrer: varchar("referrer", { length: 500 }),
  deviceType: varchar("device_type", { length: 16 }), // 'desktop' | 'mobile' | 'tablet'
  country: varchar("country", { length: 2 }),
  value: int("value"), // generic numeric field, e.g. seconds for 'page_time'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
