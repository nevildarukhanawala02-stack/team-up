import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Mail, Phone, RefreshCw, Sparkles, TrendingUp, Newspaper } from "lucide-react";
import { adminLogout, checkAdminSession, fetchLeads, type Lead } from "@/lib/api";

const SOURCE_LABELS: Record<string, string> = {
  contact_page: "Contact page",
  experience_inquiry: "Experience inquiry",
  volunteer_signup: "Volunteer signup",
  donate_inquiry: "Donate inquiry",
  partner_inquiry: "Partner inquiry",
};

function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] || source;
}

export default function Admin() {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

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
        {leads.length > 0 ? (
          <div className="category-filter" role="tablist" aria-label="Filter leads by source">
            <button type="button" role="tab" aria-selected={sourceFilter === "all"} className={`category-filter__pill ${sourceFilter === "all" ? "is-active" : ""}`} onClick={() => setSourceFilter("all")}>All</button>
            {Array.from(new Set(leads.map((l) => l.source))).map((source) => (
              <button key={source} type="button" role="tab" aria-selected={sourceFilter === source} className={`category-filter__pill ${sourceFilter === source ? "is-active" : ""}`} onClick={() => setSourceFilter(source)}>{sourceLabel(source)}</button>
            ))}
          </div>
        ) : null}

        {loading ? (
          <p className="admin-page__status">Loading…</p>
        ) : error ? (
          <p className="admin-page__status admin-page__status--error">{error}</p>
        ) : leads.length === 0 ? (
          <p className="admin-page__status">No submissions yet, they'll show up here as soon as someone fills out a form on the site.</p>
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
                {leads.filter((lead) => sourceFilter === "all" || lead.source === sourceFilter).map((lead) => (
                  <tr key={lead.id}>
                    <td>{new Date(lead.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>{lead.name}</td>
                    <td>{lead.organization || "N/A"}</td>
                    <td>
                      {lead.email ? <span className="admin-leads-table__contact"><Mail size={13} strokeWidth={1.7} /> {lead.email}</span> : null}
                      {lead.phone ? <span className="admin-leads-table__contact"><Phone size={13} strokeWidth={1.7} /> {lead.phone}</span> : null}
                      {!lead.email && !lead.phone ? "N/A" : null}
                    </td>
                    <td className="admin-leads-table__message">
                      {lead.message || "N/A"}
                      {lead.metadata && Object.keys(lead.metadata).length > 0 ? (
                        <dl className="admin-leads-table__metadata">
                          {Object.entries(lead.metadata).map(([key, value]) => (
                            <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
                          ))}
                        </dl>
                      ) : null}
                    </td>
                    <td>
                      <span className="admin-leads-table__source">{sourceLabel(lead.source)}</span>
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
