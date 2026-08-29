import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { Link, useParams } from "wouter";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { fetchBlogPost, estimateReadTime, type BlogPostRow } from "@/data/blog";
import NotFound from "@/pages/NotFound";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostRow | null | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPost(undefined);
    if (!slug) return;
    fetchBlogPost(slug)
      .then(setPost)
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) {
    return <div className="idea-grid__loading" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>;
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="blog-post-page">
      <header className="site-header experiences-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/blog" className="nav-current">Blog</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="blog-post-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}<span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="blog-post-mobile-navigation" className={`mobile-nav ${mobileOpen ? "experiences-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/blog" onClick={() => setMobileOpen(false)}>Blog</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <article className="blog-post section-paper">
          <div className="editorial-container blog-post__inner">
            <Link href="/blog" className="text-link experience-detail__back"><ArrowLeft size={14} strokeWidth={1.7} /> All posts</Link>
            <div className="blog-post__meta">
              {post.category ? <span className="blog-card__category">{post.category}</span> : null}
              <span className="blog-card__readtime">{post.readTimeMinutes || estimateReadTime(post.content)} min read</span>
              {post.publishedAt ? <span className="blog-card__date">{new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span> : null}
            </div>
            <h1>{post.title}</h1>
            {post.author ? <p className="blog-post__author">By {post.author}</p> : null}
            <BuntingDivider />
            {post.coverImage ? <img className="blog-post__cover" src={post.coverImage} alt={post.coverImageAlt || post.title} /> : null}
            <div className="blog-post__content" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.tags && post.tags.length > 0 ? (
              <div className="blog-post__tags">{post.tags.map((tag) => <span key={tag} className="blog-post__tag">{tag}</span>)}</div>
            ) : null}
          </div>
        </article>

        <section className="experience-cta section-ink" id="inquiry">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="experience-cta__layout" style={{ gridTemplateColumns: "1fr" }}>
              <div className="experience-cta__copy" data-blog-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Keep reading</p>
                <h2>More from<br /><em>the blog.</em></h2>
                <p>Every post here comes from the actual work: CSR strategy, employee experience, and what we're learning as we build.</p>
                <Link href="/blog" className="button button--coral" style={{ marginTop: "20px" }}>All posts <ArrowRight size={17} /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper experiences-footer">
        <div className="editorial-container">
          <div className="site-footer__top">
            <div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div>
            <div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:info@teamupfoundation.org.in">info@teamupfoundation.org.in</a><div className="site-footer__socials"><a href="#inquiry">Instagram</a><a href="#inquiry">LinkedIn</a></div></div>
          </div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}
