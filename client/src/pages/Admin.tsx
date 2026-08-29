import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Mail, Phone, RefreshCw, Sparkles, TrendingUp, Newspaper } from "lucide-react";
import { adminLogout, checkAdminSession, fetchLeads, type Lead } from "@/lib/api";

export default function Admin() {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminSession().then((session) => {
      if (!session.authenticated) {
        navigate("/admin/login");
        return;
      }
      setChecked(true);
      loadLeads();
    });
  }, [navigate]);

  const loadLeads = async () => {
    setLoading(true);
    const result = await fetchLeads();
    setLoading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setLeads(result.leads);
      setError("");
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
          <h1>Leads</h1>
        </div>
        <div className="admin-page__header-actions">
          <Link href="/admin/experiences" className="text-link"><Sparkles size={15} strokeWidth={1.7} /> Experiences</Link>
          <Link href="/admin/blog" className="text-link"><Newspaper size={15} strokeWidth={1.7} /> Blog</Link>
          <Link href="/admin/analytics" className="text-link"><TrendingUp size={15} strokeWidth={1.7} /> Analytics</Link>
          <button type="button" className="text-link" onClick={loadLeads}><RefreshCw size={15} strokeWidth={1.7} /> Refresh</button>
          <button type="button" className="text-link" onClick={handleLogout}><LogOut size={15} strokeWidth={1.7} /> Sign out</button>
        </div>
      </header>

      <main className="admin-page__main">
        {loading ? (
          <p className="admin-page__status">Loading…</p>
        ) : error ? (
          <p className="admin-page__status admin-page__status--error">{error}</p>
        ) : leads.length === 0 ? (
          <p className="admin-page__status">No submissions yet — they'll show up here as soon as someone fills out a form on the site.</p>
        ) : (
          <div className="admin-leads-table__wrap">
            <table className="admin-leads-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Contact</th>
                  <th>Message</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>{lead.name}</td>
                    <td>{lead.organization || "—"}</td>
                    <td>
                      {lead.email ? <span className="admin-leads-table__contact"><Mail size={13} strokeWidth={1.7} /> {lead.email}</span> : null}
                      {lead.phone ? <span className="admin-leads-table__contact"><Phone size={13} strokeWidth={1.7} /> {lead.phone}</span> : null}
                      {!lead.email && !lead.phone ? "—" : null}
                    </td>
                    <td className="admin-leads-table__message">{lead.message || "—"}</td>
                    <td>
                      <span className="admin-leads-table__source">{lead.source === "contact_page" ? "Contact page" : "Experience inquiry"}</span>
                      {lead.sourceDetail ? <span className="admin-leads-table__source-detail">{lead.sourceDetail}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
