import { useEffect, useState } from "react";

/**
 * True once the page has scrolled past `threshold` px. Used by every page's
 * fixed/sticky site-header to switch from a transparent, floats-over-the-hero
 * look to a solid, legible bar once real content is scrolling underneath it.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
