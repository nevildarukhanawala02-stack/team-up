import type { Express, Request, Response } from "express";
import { desc } from "drizzle-orm";
import { db } from "./db/client";
import { contactSubmissions } from "./db/schema";
import { createAdminSession, verifyAdminSession, getSessionCookieOptions, requireAdmin, COOKIE_NAME } from "./auth";

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
    const { name, organization, email, phone, message, source, sourceDetail } = req.body as {
      name?: string;
      organization?: string;
      email?: string;
      phone?: string;
      message?: string;
      source?: string;
      sourceDetail?: string;
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
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to save contact submission:", err);
      res.status(500).json({ error: "Something went wrong. Please try again." });
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
}
