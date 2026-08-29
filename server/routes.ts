import type { Express, Request, Response } from "express";
import { desc, eq, asc, and, gte, lte, sql } from "drizzle-orm";
import multer from "multer";
import { db } from "./db/client";
import { contactSubmissions, experiences, analyticsEvents, blogPosts } from "./db/schema";
import { createAdminSession, verifyAdminSession, getSessionCookieOptions, requireAdmin, COOKIE_NAME } from "./auth";
import { uploadToCloudinary } from "./cloudinary";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export function registerRoutes(app: Express) {
  // --- Auth ---

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password || email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const token = await createAdminSession(email);
    res.cookie(COOKIE_NAME, token, getSessionCookieOptions());
    res.json({ success: true });
  });

  app.post("/api/auth/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ success: true });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ authenticated: false });
    const session = await verifyAdminSession(token);
    if (!session) return res.status(401).json({ authenticated: false });
    res.json({ authenticated: true, email: session.email });
  });

  // --- Contact / inquiry form submissions (public) ---

  app.post("/api/contact", async (req: Request, res: Response) => {
    const { name, organization, email, phone, message, source, sourceDetail, metadata } = req.body as {
      name?: string;
      organization?: string;
      email?: string;
      phone?: string;
      message?: string;
      source?: string;
      sourceDetail?: string;
      metadata?: Record<string, string>;
    };

    if (!name || !source) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    try {
      await db.insert(contactSubmissions).values({
        name,
        organization: organization || null,
        email: email || null,
        phone: phone || null,
        message: message || null,
        source,
        sourceDetail: sourceDetail || null,
        metadata: metadata && Object.keys(metadata).length > 0 ? metadata : null,
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save contact submission:", err);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  // --- Analytics (public track, admin-only dashboard) ---

  // Fire-and-forget from the client: never throws, always responds success
  // so a broken analytics call can never surface as an error to a visitor.
  app.post("/api/analytics/track", async (req: Request, res: Response) => {
    const { sessionId, eventType, pagePath, referrer, deviceType, value } = req.body as {
      sessionId?: string;
      eventType?: string;
      pagePath?: string;
      referrer?: string;
      deviceType?: string;
      value?: number;
    };
    if (!sessionId || !eventType) {
      return res.json({ success: false });
    }
    try {
      await db.insert(analyticsEvents).values({
        sessionId: sessionId.slice(0, 64),
        eventType: eventType.slice(0, 64),
        pagePath: pagePath ? pagePath.slice(0, 255) : null,
        referrer: referrer ? referrer.slice(0, 500) : null,
        deviceType: deviceType ? deviceType.slice(0, 16) : null,
        value: typeof value === "number" ? value : null,
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to record analytics event:", err);
      res.json({ success: false });
    }
  });

  // --- Admin (protected) ---

  app.get("/api/admin/leads", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const rows = await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(200);
      res.json({ leads: rows });
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  // Visits -> experience-detail views -> contact-form inquiries.
  // "Visits" and "experience views" both come from the generic page_view
  // event stream (grouped by page_path); the conversion count is read
  // straight from contact_submissions rather than duplicated into
  // analytics_events, so lead data always has one source of truth.
  app.get("/api/admin/analytics", requireAdmin, async (req: Request, res: Response) => {
    try {
      const range = req.query.range === "week" ? "week" : "month";
      const days = range === "week" ? 7 : 30;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const pageViewBase = and(
        eq(analyticsEvents.eventType, "page_view"),
        gte(analyticsEvents.createdAt, since),
        sql`${analyticsEvents.pagePath} NOT LIKE '/admin%'`,
      );

      const [[visitsRow], [pageViewsRow], [experienceViewsRow], [conversionsRow], leaderboardRaw] = await Promise.all([
        db.select({ count: sql<number>`COUNT(DISTINCT ${analyticsEvents.sessionId})` }).from(analyticsEvents).where(pageViewBase),
        db.select({ count: sql<number>`COUNT(*)` }).from(analyticsEvents).where(pageViewBase),
        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(analyticsEvents)
          .where(and(eq(analyticsEvents.eventType, "page_view"), gte(analyticsEvents.createdAt, since), sql`${analyticsEvents.pagePath} LIKE '/experiences/%'`)),
        db.select({ count: sql<number>`COUNT(*)` }).from(contactSubmissions).where(gte(contactSubmissions.createdAt, since)),
        db.execute(sql`
          SELECT page_path AS pagePath, COUNT(*) AS views
          FROM analytics_events
          WHERE event_type = 'page_view' AND page_path LIKE '/experiences/%' AND created_at >= ${since}
          GROUP BY page_path
          ORDER BY views DESC
          LIMIT 5
        `),
      ]);

      const visits = Number(visitsRow?.count || 0);
      const pageViews = Number(pageViewsRow?.count || 0);
      const experienceViews = Number(experienceViewsRow?.count || 0);
      const conversions = Number(conversionsRow?.count || 0);

      const leaderboardRows = (leaderboardRaw as unknown as [{ pagePath: string; views: number }[], unknown])[0];
      const slugs = leaderboardRows.map((row) => row.pagePath.replace(/^\/experiences\//, ""));
      const nameRows = slugs.length > 0 ? await db.select({ slug: experiences.slug, name: experiences.name }).from(experiences) : [];
      const nameBySlug = new Map(nameRows.map((row) => [row.slug, row.name]));
      const leaderboard = leaderboardRows.map((row) => {
        const slug = row.pagePath.replace(/^\/experiences\//, "");
        return { slug, name: nameBySlug.get(slug) || slug, views: Number(row.views) };
      });

      res.json({
        range,
        metrics: {
          visits,
          pageViews,
          pagesPerVisit: visits > 0 ? Math.round((pageViews / visits) * 10) / 10 : 0,
          experienceViews,
          conversions,
          conversionRate: visits > 0 ? Math.round((conversions / visits) * 1000) / 10 : 0,
        },
        funnel: [
          { label: "Visits", value: visits },
          { label: "Experience views", value: experienceViews },
          { label: "Inquiries", value: conversions },
        ],
        leaderboard,
      });
    } catch (err) {
      console.error("Failed to build analytics dashboard:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  // --- Experiences (public read, admin write) ---

  app.get("/api/experiences", async (_req: Request, res: Response) => {
    try {
      const rows = await db.select().from(experiences).orderBy(asc(experiences.displayOrder));
      res.json({ experiences: rows });
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.get("/api/experiences/:slug", async (req: Request, res: Response) => {
    try {
      const rows = await db.select().from(experiences).where(eq(experiences.slug, req.params.slug)).limit(1);
      if (rows.length === 0) return res.status(404).json({ error: "Not found." });
      res.json({ experience: rows[0] });
    } catch (err) {
      console.error("Failed to fetch experience:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.get("/api/admin/experiences", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const rows = await db.select().from(experiences).orderBy(asc(experiences.displayOrder));
      res.json({ experiences: rows });
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.post("/api/admin/experiences", requireAdmin, async (req: Request, res: Response) => {
    try {
      const body = req.body as typeof experiences.$inferInsert;
      if (!body.slug || !body.name) {
        return res.status(400).json({ error: "Slug and name are required." });
      }
      const result = await db.insert(experiences).values(body);
      res.json({ success: true, id: result[0].insertId });
    } catch (err: any) {
      console.error("Failed to create experience:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "An experience with that slug already exists." });
      }
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.put("/api/admin/experiences/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as Partial<typeof experiences.$inferInsert>;
      await db.update(experiences).set(body).where(eq(experiences.id, id));
      res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to update experience:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "An experience with that slug already exists." });
      }
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.delete("/api/admin/experiences/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await db.delete(experiences).where(eq(experiences.id, id));
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to delete experience:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  // --- Blog (public read of published posts, admin write of all posts) ---

  app.get("/api/blog", async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      const limit = req.query.limit ? Math.min(Number(req.query.limit) || 20, 50) : 50;

      const conditions = [eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, now)];
      if (category) conditions.push(eq(blogPosts.category, category));

      const rows = await db
        .select()
        .from(blogPosts)
        .where(and(...conditions))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(limit);
      res.json({ posts: rows });
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      const now = new Date();
      const rows = await db
        .select()
        .from(blogPosts)
        .where(and(eq(blogPosts.slug, req.params.slug), eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, now)))
        .limit(1);
      if (rows.length === 0) return res.status(404).json({ error: "Not found." });
      res.json({ post: rows[0] });
    } catch (err) {
      console.error("Failed to fetch blog post:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.get("/api/admin/blog", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
      res.json({ posts: rows });
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.post("/api/admin/blog", requireAdmin, async (req: Request, res: Response) => {
    try {
      const body = req.body as typeof blogPosts.$inferInsert;
      if (!body.slug || !body.title || !body.content) {
        return res.status(400).json({ error: "Slug, title, and content are required." });
      }
      // Publishing for the first time with no publishedAt set -> stamp it now,
      // so switching a draft to "Published" without picking a date still works.
      if (body.status === "published" && !body.publishedAt) {
        body.publishedAt = new Date();
      }
      const result = await db.insert(blogPosts).values(body);
      res.json({ success: true, id: result[0].insertId });
    } catch (err: any) {
      console.error("Failed to create blog post:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "A post with that slug already exists." });
      }
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.put("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as Partial<typeof blogPosts.$inferInsert>;
      if (body.status === "published" && !body.publishedAt) {
        body.publishedAt = new Date();
      }
      await db.update(blogPosts).set(body).where(eq(blogPosts.id, id));
      res.json({ success: true });
    } catch (err: any) {
      console.error("Failed to update blog post:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "A post with that slug already exists." });
      }
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to delete blog post:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  // --- Image upload (admin only) ---

  app.post("/api/admin/upload", requireAdmin, upload.single("file"), async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Only image files are allowed." });
    }
    try {
      const url = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      res.json({ success: true, url });
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      res.status(500).json({ error: "Upload failed. Please try again." });
    }
  });
}
