import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

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
