import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Plus, Trash2, Pencil, Users, Sparkles, TrendingUp } from "lucide-react";
import { adminLogout, checkAdminSession, fetchAdminExperiences, deleteExperience } from "@/lib/api";
import type { ExperienceRow } from "@/data/experiences";

export default function AdminExperiences() {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState<ExperienceRow[]>([]);
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
    const result = await fetchAdminExperiences();
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setItems(result.experiences);
      setError("");
    }
  };

  const handleDelete = async (item: ExperienceRow) => {
    if (!confirm(`Delete "${item.name}"? This can't be undone.`)) return;
    const result = await deleteExperience(item.id);
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
          <h1>Experiences</h1>
        </div>
        <div className="admin-page__header-actions">
          <Link href="/admin" className="text-link"><Users size={15} strokeWidth={1.7} /> Leads</Link>
          <Link href="/admin/analytics" className="text-link"><TrendingUp size={15} strokeWidth={1.7} /> Analytics</Link>
          <button type="button" className="text-link" onClick={handleLogout}><LogOut size={15} strokeWidth={1.7} /> Sign out</button>
        </div>
      </header>

      <main className="admin-page__main">
        <div className="admin-experiences__toolbar">
          <Link href="/admin/experiences/new" className="button button--coral"><Plus size={17} /> Add experience</Link>
        </div>

        {loading ? (
          <p className="admin-page__status">Loading…</p>
        ) : error ? (
          <p className="admin-page__status admin-page__status--error">{error}</p>
        ) : items.length === 0 ? (
          <p className="admin-page__status">No experiences yet.</p>
        ) : (
          <div className="admin-experiences-list">
            {items.map((item) => (
              <div className="admin-experiences-list__row" key={item.id}>
                <div className="admin-experiences-list__badge">
                  {item.isReal ? <span className="idea-card__real-badge admin-experiences-list__badge-inline">Delivered</span> : <span className="idea-card__concept-badge admin-experiences-list__badge-inline"><Sparkles size={11} /> Concept</span>}
                </div>
                <div className="admin-experiences-list__info">
                  <strong>{item.name}</strong>
                  <span>{item.slug} · {item.category} · {item.format}</span>
                </div>
                <div className="admin-experiences-list__actions">
                  <Link href={`/admin/experiences/${item.id}`} className="text-link"><Pencil size={14} strokeWidth={1.7} /> Edit</Link>
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
