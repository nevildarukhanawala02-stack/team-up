/**
 * Team Up Blog: list of published posts, in the same paper/ink/coral/gold/teal
 * editorial vocabulary as the rest of the site. Reuses the header/nav/footer
 * pattern from Experiences.tsx and the reveal-on-scroll approach that
 * re-scans after async data loads.
 */

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "wouter";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { blogCategories, fetchBlogPosts, estimateReadTime, type BlogPostRow } from "@/data/blog";

function useReveal(deps: React.DependencyList) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-blog-reveal]:not(.is-visible)"));
    if (items.length === 0) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function Blog() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  useReveal([loading, activeCategory, posts.length]);

  const categoriesPresent = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
  const visiblePosts = activeCategory === "all" ? posts : posts.filter((p) => p.category === activeCategory);
  const pillarGuides = visiblePosts.filter((p) => p.postType === "pillar_guide");
  const otherPosts = visiblePosts.filter((p) => p.postType !== "pillar_guide");

  return (
    <div className="blog-page">
      <header className="site-header experiences-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/blog" className="nav-current">Blog</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/partner">Partner with us</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="blog-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}<span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="blog-mobile-navigation" className={`mobile-nav ${mobileOpen ? "experiences-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/blog" onClick={() => setMobileOpen(false)}>Blog</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/partner" onClick={() => setMobileOpen(false)}>Partner with us</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="experiences-hero blog-hero section-paper">
          <div className="editorial-container experiences-hero__inner" data-blog-reveal>
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / Blog</p>
            <h1 className="hero-message"><span>Notes on</span><span>celebration</span><em>and impact.</em></h1>
            <p>Thinking from inside the work: what we're learning about CSR, employee experience, and building days that mean something to the people at the center of them.</p>
            <BuntingDivider />
          </div>
        </section>

        <section className="idea-section section-sand section-space">
          <div className="editorial-container">
            {pillarGuides.length > 0 ? (
              <div className="blog-pillar-guides" data-blog-reveal>
                <p className="blog-pillar-guides__label">Start here</p>
                <div className="blog-pillar-guides__grid">
                  {pillarGuides.map((post) => (
                    <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-pillar-card">
                      {post.coverImage ? <img className="blog-pillar-card__photo" src={post.coverImage} alt={post.coverImageAlt || post.title} /> : null}
                      <div className="blog-pillar-card__body">
                        <div className="blog-card__meta">
                          {post.category ? <span className="blog-card__category">{post.category}</span> : null}
                          <span className="blog-card__readtime">Pillar guide · {post.readTimeMinutes || estimateReadTime(post.content)} min read</span>
                        </div>
                        <h3>{post.title}</h3>
                        {post.excerpt ? <p>{post.excerpt}</p> : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {categoriesPresent.length > 0 ? (
              <div className="category-filter" role="tablist" aria-label="Filter posts by category" data-blog-reveal>
                <button type="button" role="tab" aria-selected={activeCategory === "all"} className={`category-filter__pill ${activeCategory === "all" ? "is-active" : ""}`} onClick={() => setActiveCategory("all")}>All</button>
                {(blogCategories.filter((c) => categoriesPresent.includes(c)) as string[]).map((category) => (
                  <button key={category} type="button" role="tab" aria-selected={activeCategory === category} className={`category-filter__pill ${activeCategory === category ? "is-active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>
                ))}
              </div>
            ) : null}

            {loading ? (
              <p className="idea-grid__loading">Loading posts…</p>
            ) : otherPosts.length === 0 && pillarGuides.length === 0 ? (
              <p className="idea-grid__loading">No posts yet, check back soon.</p>
            ) : otherPosts.length > 0 ? (
              <div className="blog-grid">
                {otherPosts.map((post, index) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card" data-blog-reveal style={{ animationDelay: `${(index % 6) * 45}ms` }}>
                    {post.coverImage ? <img className="blog-card__photo" src={post.coverImage} alt={post.coverImageAlt || post.title} /> : null}
                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        {post.category ? <span className="blog-card__category">{post.category}</span> : null}
                        <span className="blog-card__readtime">{post.readTimeMinutes || estimateReadTime(post.content)} min read</span>
                      </div>
                      <h3>{post.title}</h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                      <span className="blog-card__date">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : ""}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper experiences-footer">
        <div className="editorial-container">
          <div className="site-footer__top">
            <div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div>
            <div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:info@teamupfoundation.org.in">info@teamupfoundation.org.in</a><div className="site-footer__socials"><a href="https://www.linkedin.com/company/teamup-foundation-india" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div>
          </div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}
