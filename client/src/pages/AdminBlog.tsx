import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Plus, Trash2, Pencil, Users, Sparkles, TrendingUp, Newspaper } from "lucide-react";
import { adminLogout, checkAdminSession, fetchAdminBlogPosts, deleteBlogPost } from "@/lib/api";
import type { BlogPostRow } from "@/data/blog";

export default function AdminBlog() {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminSession().then((session) => {
      if (!session.authenticated) {
        navigate("/admin/login");
        return;
      }
      setChecked(true);
      load();
    });
  }, [navigate]);

  const load = async () => {
    setLoading(true);
    const result = await fetchAdminBlogPosts();
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setItems(result.posts);
      setError("");
    }
  };

  const handleDelete = async (item: BlogPostRow) => {
    if (!confirm(`Delete "${item.title}"? This can't be undone.`)) return;
    const result = await deleteBlogPost(item.id);
    if (result.success) {
      load();
    } else {
      alert(result.error || "Failed to delete.");
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  if (!checked) return null;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow"><span className="eyebrow__dot" /> Team Up Admin</p>
          <h1>Blog</h1>
        </div>
        <div className="admin-page__header-actions">
          <Link href="/admin" className="text-link"><Users size={15} strokeWidth={1.7} /> Leads</Link>
          <Link href="/admin/experiences" className="text-link"><Sparkles size={15} strokeWidth={1.7} /> Experiences</Link>
          <Link href="/admin/analytics" className="text-link"><TrendingUp size={15} strokeWidth={1.7} /> Analytics</Link>
          <button type="button" className="text-link" onClick={handleLogout}><LogOut size={15} strokeWidth={1.7} /> Sign out</button>
        </div>
      </header>

      <main className="admin-page__main">
        <div className="admin-experiences__toolbar">
          <Link href="/admin/blog/new" className="button button--coral"><Plus size={17} /> New post</Link>
        </div>

        {loading ? (
          <p className="admin-page__status">Loading…</p>
        ) : error ? (
          <p className="admin-page__status admin-page__status--error">{error}</p>
        ) : items.length === 0 ? (
          <p className="admin-page__status">No posts yet.</p>
        ) : (
          <div className="admin-experiences-list">
            {items.map((item) => (
              <div className="admin-experiences-list__row" key={item.id}>
                <div className="admin-experiences-list__badge">
                  {item.status === "published" ? (
                    <span className="idea-card__real-badge admin-experiences-list__badge-inline">Published</span>
                  ) : (
                    <span className="idea-card__concept-badge admin-experiences-list__badge-inline"><Newspaper size={11} /> Draft</span>
                  )}
                </div>
                <div className="admin-experiences-list__info">
                  <strong>{item.title}</strong>
                  <span>{item.slug} · {item.category || "Uncategorized"} · {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "Not published"}</span>
                </div>
                <div className="admin-experiences-list__actions">
                  <Link href={`/admin/blog/${item.id}`} className="text-link"><Pencil size={14} strokeWidth={1.7} /> Edit</Link>
                  <button type="button" className="text-link admin-experiences-list__delete" onClick={() => handleDelete(item)}><Trash2 size={14} strokeWidth={1.7} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
