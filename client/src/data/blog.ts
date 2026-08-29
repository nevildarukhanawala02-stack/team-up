/**
 * Team Up blog: post types and public-facing fetch helpers.
 *
 * Content is authored as rich HTML from the TipTap editor in /admin/blog.
 * Only 'published' posts with a past/present publishedAt are ever returned
 * by the public endpoints below; draft posts stay admin-only.
 */

export const blogCategories = [
  "CSR Strategy",
  "Employee Experience",
  "Impact Stories",
  "Partner Spotlight",
  "News",
] as const;

export type BlogCategory = (typeof blogCategories)[number] | string;

/** Raw shape returned by /api/blog, matches the database row. */
export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  content: string;
  category: string | null;
  postType: string; // 'pillar_guide' | 'cluster_article' | 'faq_hub'
  tags: string[] | null;
  author: string | null;
  status: string; // 'draft' | 'published'
  publishedAt: string | null;
  readTimeMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

export async function fetchBlogPosts(options?: { category?: string; limit?: number }): Promise<BlogPostRow[]> {
  const params = new URLSearchParams();
  if (options?.category) params.set("category", options.category);
  if (options?.limit) params.set("limit", String(options.limit));
  const qs = params.toString();
  const res = await fetch(`/api/blog${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to load blog posts.");
  const data = await res.json();
  return data.posts as BlogPostRow[];
}

export async function fetchBlogPost(slug: string): Promise<BlogPostRow | null> {
  const res = await fetch(`/api/blog/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load blog post.");
  const data = await res.json();
  return data.post as BlogPostRow;
}

/** Rough reading time from plain-text word count, used as a fallback when readTimeMinutes isn't set. */
export function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
