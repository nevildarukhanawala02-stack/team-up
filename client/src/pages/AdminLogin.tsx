import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Lock } from "lucide-react";
import { adminLogin, checkAdminSession } from "@/lib/api";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAdminSession().then((session) => {
      if (session.authenticated) navigate("/admin");
    });
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await adminLogin(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-card__icon"><Lock size={22} strokeWidth={1.6} /></div>
        <h1>Team Up Admin</h1>
        <p>Sign in to view leads and site analytics.</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error ? <p className="admin-login-card__error">{error}</p> : null}
          <button type="submit" className="button button--coral" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"} <ArrowRight size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}
