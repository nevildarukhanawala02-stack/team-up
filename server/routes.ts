import type { Express, Request, Response } from "express";
import { desc, eq, asc } from "drizzle-orm";
import multer from "multer";
import { db } from "./db/client";
import { contactSubmissions, experiences } from "./db/schema";
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
