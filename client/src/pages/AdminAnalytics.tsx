import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LogOut, Sparkles, Users, TrendingUp } from "lucide-react";
import { adminLogout, checkAdminSession, fetchAnalytics, type AnalyticsData } from "@/lib/api";

export default function AdminAnalytics() {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState(false);
  const [range, setRange] = useState<"week" | "month">("month");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAdminSession().then((session) => {
      if (!session.authenticated) {
        navigate("/admin/login");
        return;
      }
      setChecked(true);
    });
  }, [navigate]);

  useEffect(() => {
    if (!checked) return;
    setLoading(true);
    fetchAnalytics(range).then((result) => {
      setLoading(false);
      if ("error" in result) {
        setError(result.error);
      } else {
        setData(result);
        setError("");
      }
    });
  }, [checked, range]);

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  if (!checked) return null;

  const maxFunnelValue = data?.funnel[0]?.value || 1;
  const maxLeaderboardViews = data?.leaderboard[0]?.views || 1;

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="eyebrow"><span className="eyebrow__dot" /> Team Up Admin</p>
          <h1>Analytics</h1>
        </div>
        <div className="admin-page__header-actions">
          <Link href="/admin" className="text-link"><Users size={15} strokeWidth={1.7} /> Leads</Link>
          <Link href="/admin/experiences" className="text-link"><Sparkles size={15} strokeWidth={1.7} /> Experiences</Link>
          <button type="button" className="text-link" onClick={handleLogout}><LogOut size={15} strokeWidth={1.7} /> Sign out</button>
        </div>
      </header>

      <main className="admin-page__main">
        <div className="admin-analytics__toolbar">
          <div className="admin-analytics__range-toggle">
            <button type="button" className={range === "week" ? "is-active" : ""} onClick={() => setRange("week")}>Last 7 days</button>
            <button type="button" className={range === "month" ? "is-active" : ""} onClick={() => setRange("month")}>Last 30 days</button>
          </div>
        </div>

        {loading ? (
          <p className="admin-page__status">Loading…</p>
        ) : error ? (
          <p className="admin-page__status admin-page__status--error">{error}</p>
        ) : !data ? null : (
          <>
            <div className="admin-analytics__metrics">
              <div className="admin-analytics__metric-card">
                <span>Visits</span>
                <strong>{data.metrics.visits.toLocaleString()}</strong>
              </div>
              <div className="admin-analytics__metric-card">
                <span>Pages / visit</span>
                <strong>{data.metrics.pagesPerVisit.toLocaleString()}</strong>
              </div>
              <div className="admin-analytics__metric-card">
                <span>Experience views</span>
                <strong>{data.metrics.experienceViews.toLocaleString()}</strong>
              </div>
              <div className="admin-analytics__metric-card">
                <span>Inquiries</span>
                <strong>{data.metrics.conversions.toLocaleString()}</strong>
              </div>
              <div className="admin-analytics__metric-card">
                <span>Conversion rate</span>
                <strong>{data.metrics.conversionRate}%</strong>
              </div>
            </div>

            <div className="admin-analytics__row">
              <section className="admin-analytics__panel">
                <h2><TrendingUp size={16} strokeWidth={1.7} /> Funnel</h2>
                <div className="admin-analytics__funnel">
                  {data.funnel.map((stage) => (
                    <div className="admin-analytics__funnel-row" key={stage.label}>
                      <span className="admin-analytics__funnel-label">{stage.label}</span>
                      <div className="admin-analytics__funnel-track">
                        <div
                          className="admin-analytics__funnel-bar"
                          style={{ width: `${maxFunnelValue > 0 ? Math.max((stage.value / maxFunnelValue) * 100, stage.value > 0 ? 4 : 0) : 0}%` }}
                        />
                      </div>
                      <span className="admin-analytics__funnel-value">{stage.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-analytics__panel">
                <h2><Sparkles size={16} strokeWidth={1.7} /> Top experiences</h2>
                {data.leaderboard.length === 0 ? (
                  <p className="admin-page__status">No experience views in this period yet.</p>
                ) : (
                  <ol className="admin-analytics__leaderboard">
                    {data.leaderboard.map((item) => (
                      <li key={item.slug}>
                        <span className="admin-analytics__leaderboard-name">{item.name}</span>
                        <div className="admin-analytics__leaderboard-track">
                          <div
                            className="admin-analytics__leaderboard-bar"
                            style={{ width: `${maxLeaderboardViews > 0 ? Math.max((item.views / maxLeaderboardViews) * 100, 4) : 0}%` }}
                          />
                        </div>
                        <span className="admin-analytics__leaderboard-value">{item.views.toLocaleString()}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
