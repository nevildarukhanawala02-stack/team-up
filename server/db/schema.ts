import { mysqlTable, int, varchar, text, timestamp, boolean, json } from "drizzle-orm/mysql-core";

/**
 * The full experiences catalogue — real, delivered experiences and concept
 * ideas, in one table. `isReal` decides which set of fields matter:
 *  - isReal=true  -> heroImage/heroAlt/partner/storyDirection/ceremony/
 *                    highlights/gallery/proof/pressLinks/storyLink are used
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
  highlights: json("highlights").$type<string[]>(),
  gallery: json("gallery").$type<{ src: string; alt: string; caption: string }[]>(),
  proof: varchar("proof", { length: 255 }),
  pressLinks: json("press_links").$type<{ title: string; source: string; url: string }[]>(),
  storyLink: varchar("story_link", { length: 128 }),
  imagePlaceholder: boolean("image_placeholder").default(false),

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
