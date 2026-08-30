import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { track } from "@/lib/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Mounted once near the app root. Fires a page_view analytics event on every
 * route change, both to our own internal analytics (/api/analytics/track)
 * and to Google Analytics 4. Admin routes are deliberately excluded from
 * both so admin usage never pollutes visitor metrics.
 *
 * GA4's base snippet in index.html loads the gtag.js script and defines
 * window.gtag but deliberately sends no initial page_view (send_page_view:
 * false), since this is a single-page app: every navigation, including the
 * first, is a client-side route change, not a real page load, so GA4 page
 * views are sent from here instead of relying on the library's automatic
 * one-time page_view on script load.
 */
export default function RouteTracker() {
  const [location] = useLocation();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (location === lastTracked.current) return;
    lastTracked.current = location;
    if (location.startsWith("/admin")) return;

    track("page_view", { pagePath: location });

    if (typeof window.gtag === "function") {
      // Deferred a tick: individual pages set document.title in their own
      // effect, and effect order between sibling components (this tracker
      // vs. the routed page) isn't guaranteed, so reading it synchronously
      // here could occasionally capture the previous page's title.
      const gtag = window.gtag;
      setTimeout(() => {
        gtag("event", "page_view", {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location,
        });
      }, 0);
    }
  }, [location]);

  return null;
}
