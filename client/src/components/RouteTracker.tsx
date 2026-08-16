import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { track } from "@/lib/analytics";

/**
 * Mounted once near the app root. Fires a page_view analytics event on every
 * route change. Admin routes are deliberately excluded so admin usage never
 * pollutes visitor metrics.
 */
export default function RouteTracker() {
  const [location] = useLocation();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (location === lastTracked.current) return;
    lastTracked.current = location;
    if (location.startsWith("/admin")) return;
    track("page_view", { pagePath: location });
  }, [location]);

  return null;
}
