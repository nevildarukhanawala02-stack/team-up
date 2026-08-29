/**
 * Lightweight, self-hosted analytics client. No third-party service, no
 * cookies beyond what the admin session already uses, just a session id in
 * localStorage and a fire-and-forget POST to our own /api/analytics/track.
 *
 * Design rules (carried over from the reference playbook):
 * - Tracking is fire-and-forget end to end. Callers never await track(), and
 *   track() itself never throws, a broken analytics call must never break
 *   the site or interrupt navigation.
 * - Real conversions (contact form submissions) are never logged here; the
 *   admin dashboard reads the real contact_submissions table directly so
 *   there's a single source of truth.
 * - /admin* routes are never tracked, so admin usage doesn't pollute visitor
 *   metrics.
 */

const SESSION_KEY = "teamup_analytics_session";

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Storage unavailable (private browsing, etc.), fall back to a
    // per-page-load id rather than breaking tracking entirely.
    return "no-storage";
  }
}

function detectDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent || "";
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  return "desktop";
}

interface TrackOptions {
  pagePath?: string;
  value?: number;
}

/**
 * Fires an analytics event and forgets it. Never throws, never returns
 * anything callers need to handle, call it and move on.
 */
export function track(eventType: string, options: TrackOptions = {}): void {
  try {
    const payload = {
      sessionId: getSessionId(),
      eventType,
      pagePath: options.pagePath ?? window.location.pathname,
      referrer: document.referrer || "",
      deviceType: detectDeviceType(),
      value: options.value,
    };
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Swallow network errors, analytics must never surface to the user.
    });
  } catch {
    // Swallow anything else (e.g. JSON.stringify on a weird value).
  }
}
