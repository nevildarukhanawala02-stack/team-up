/**
 * Team Up Civic Editorial page: a warm, asymmetrical, documentary-led homepage that treats
 * celebration as a dignified signal of attention. Copy follows the supplied framework; images
 * are intentionally replaceable generated placeholders until approved real event photography arrives.
 */

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Heart,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { submitContactForm } from "@/lib/api";
import { fetchBlogPosts, estimateReadTime, type BlogPostRow } from "@/data/blog";

const proofStories = [
  {
    number: "01",
    title: "The Beat That Traveled",
    subtitle: "The Dharavi Dream Project",
    text: "A group of young dancers from Dharavi got the stage — and the city — their talent always deserved. One video of the day crossed 500,000 views, entirely on its own.",
    image: "/images/dharavi-dreams-hero.jpg",
    alt: "Young performers mid-jump under red stage lighting during Dharavi Dreams, a hip-hop theatre production",
    color: "coral",
    proof: "500,000 organic views",
  },
  {
    number: "02",
    title: "Colors on the Ward",
    subtitle: "Access Life Assistance Foundation",
    text: "Kids on a hospital ward spent an afternoon as artists, not patients — every single one went home a winner. A few of their actual drawings are still on our site, not just photos of the day.",
    image: "/images/access-life-hero.jpg",
    alt: "A group of children in matching Little Rockstars t-shirts posing together with a parent",
    color: "teal",
    proof: "Every one went home a winner",
  },
  {
    number: "03",
    title: "Independence Day Children's Festival",
    subtitle: "Giving Tree Foundation",
    text: "A banquet hall, 300 kids, and a full-scale Independence Day celebration we showed up to be part of — on a date that doesn't usually feel like theirs, made theirs for an afternoon.",
    image: "/images/giving-tree-hero.jpg",
    alt: "A large hall full of children celebrating together under chandeliers",
    color: "gold",
    proof: "300 children, celebrating together",
  },
];

const causeTags = ["Education", "Environment", "Health", "Women’s empowerment", "Whatever your cause"];

function useReveal(deps: React.DependencyList = []) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
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
      { threshold: 0.14 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPostRow[]>([]);

  useEffect(() => {
    fetchBlogPosts({ limit: 3 })
      .then(setBlogPosts)
      .catch(() => setBlogPosts([]));
  }, []);

  useReveal([blogPosts.length]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    const result = await submitContactForm({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
      source: "contact_page",
      sourceDetail: "Homepage inquiry",
    });
    setSubmitting(false);
    if (result.success) {
      toast("Thanks — we\u2019ve got it.", { description: "We\u2019ll be in touch soon." });
      form.reset();
    } else {
      toast("Something went wrong.", { description: result.error });
    }
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <div className="teamup-page">
      <header className={`site-header ${mobileOpen ? "site-header--open" : ""}`}>
        <div className="site-header__inner">
          <a className="brand-link" href="#top" aria-label="Team Up home" onClick={closeMenu}>
            <TeamUpLogo compact />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/blog">Blog</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/partner">Partner with us</a>
            <a href="/contact" className="nav-cta">
              Contact us <MoveUpRight size={15} strokeWidth={1.7} />
            </a>
          </nav>

          <button
            className="mobile-menu-button"
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>

        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          <a href="/experiences" onClick={closeMenu}>Experiences <ArrowRight size={16} /></a>
          <a href="/about" onClick={closeMenu}>About us <ArrowRight size={16} /></a>
          <a href="/stories" onClick={closeMenu}>Our stories <ArrowRight size={16} /></a>
          <a href="/blog" onClick={closeMenu}>Blog <ArrowRight size={16} /></a>
          <a href="/how-we-celebrate" onClick={closeMenu}>How we celebrate <ArrowRight size={16} /></a>
          <a href="/partner" onClick={closeMenu}>Partner with us <ArrowRight size={16} /></a>
          <a href="/contact" onClick={closeMenu}>Contact us <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section section-paper">
          <div className="hero-section__inner editorial-container">
            <div className="hero-copy" data-reveal>
              <h1 className="hero-seo-tag">Mumbai’s Collaborative NGO</h1>
              <h2 className="hero-message"><span>Turning</span><span>Ideas into</span><em>Impact</em></h2>
              <p className="hero-lede">
                Every idea starts somewhere — a cause, a celebration, a story worth telling. We shape it into a day that means something, and leave behind something that lasts.
              </p>
              <BuntingDivider />
              <div className="hero-actions">
                <a href="#proof" className="button button--ink">See what we’ve built <ArrowDownRight size={17} /></a>
                <a href="#contact" className="text-link">Start a conversation <ArrowRight size={17} /></a>
              </div>
            </div>

            <div className="hero-visual" data-reveal style={{ animationDelay: "110ms" }}>
              <div className="hero-visual__frame">
                <img src="/images/team-up-hero.jpg" alt="A warm community celebration in Mumbai" />
                <div className="hero-visual__wash" />
                <div className="hero-visual__caption">
                  <span>Make the moment matter.</span>
                  <span className="hero-visual__caption-line" />
                  <span>01 / 09</span>
                </div>
              </div>
              <div className="hero-visual__aside">
                <span>For teams who want<br />more from the day.</span>
                <ArrowDownRight size={20} strokeWidth={1.4} />
              </div>
            </div>
          </div>
          <div className="hero-section__edge" aria-hidden="true" />
        </section>

        <section className="truth-section section-ink" data-reveal>
          <div className="truth-section__inner editorial-container">
            <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> The Team Up point of view</p>
            <h2>We don’t help people.<br /><em>We celebrate them.</em></h2>
            <p className="truth-section__sub">We don’t give handouts. We create moments worth remembering.</p>
            <BuntingDivider light />
          </div>
        </section>

        <section className="mission-section section-paper section-space" id="mission">
          <div className="editorial-container">
            <div className="section-heading section-heading--split" data-reveal>
              <div>
                <p className="eyebrow"><span className="eyebrow__dot" /> What we do</p>
                <h2>Make the day feel as meaningful as the cause.</h2>
              </div>
              <p className="section-heading__aside">The cause is already important. We help the people inside it feel that too.</p>
            </div>

            <div className="mission-layout">
              <div className="mission-copy" data-reveal>
                <p>
                  Every CSR mandate comes with a cause and a “do something with our employees” requirement — education, environment, health, women’s empowerment, whatever your team is already committed to.
                </p>
                <p>
                  We partner with your CSR team to design and deliver that activity as something genuinely memorable: co-created with you, handled end-to-end, wrapped in a little bit of celebration. What you get is a day your employees actually remember.
                </p>
                <a href="#contact" className="arrow-link">Bring us the brief <ArrowRight size={18} /></a>
              </div>
              <figure className="mission-image" data-reveal style={{ animationDelay: "90ms" }}>
                <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=85" alt="People working together during a community activity" />
                <figcaption><span>Co-created with you.</span><span>Handled end-to-end.</span></figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="proof-section section-sand" id="proof">
          <div className="editorial-container">
            <div className="section-heading section-heading--proof" data-reveal>
              <p className="eyebrow"><span className="eyebrow__dot" /> Proof over promises</p>
              <h2>Some stories we’ve already told.</h2>
              <p>Real people, real days, and the little details that made them stay with us.</p>
            </div>

            <div className="proof-grid">
              {proofStories.map((story, index) => (
                <article className={`proof-card proof-card--${story.color}`} key={story.title} data-reveal style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="proof-card__image-wrap">
                    <img src={story.image} alt={story.alt} />
                    <span className="proof-card__number">{story.number}</span>
                  </div>
                  <div className="proof-card__body">
                    <p className="proof-card__subtitle">{story.subtitle}</p>
                    <h3>{story.title}</h3>
                    <p>{story.text}</p>
                    <p className="proof-card__proof">{story.proof}</p>
                    <span className="proof-card__rule" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>

            <div className="concept-teaser" data-reveal>
              <a href="/experiences" className="button button--ink">See all our experiences <ArrowRight size={17} /></a>
            </div>

          </div>
        </section>

        <section className="approach-section section-paper section-space" id="approach">
          <div className="editorial-container">
            <div className="section-heading section-heading--split" data-reveal>
              <div>
                <p className="eyebrow"><span className="eyebrow__dot" /> How we celebrate</p>
                <h2>Every day starts with a story.</h2>
              </div>
              <p className="section-heading__aside">A little ceremony. A little surprise. A lot of intention.</p>
            </div>

            <div className="approach-grid">
              <article className="approach-card" data-reveal>
                <span className="approach-card__index">01</span>
                <span className="approach-card__icon approach-card__icon--gold"><span className="approach-card__flag" /></span>
                <h3>Start with the story.</h3>
                <p>Before anything happens, we decide what the day is really about — with you. Then we make sure everyone involved, from the crew to the camera, is telling that same story.</p>
              </article>
              <article className="approach-card" data-reveal style={{ animationDelay: "70ms" }}>
                <span className="approach-card__index">02</span>
                <span className="approach-card__icon approach-card__icon--coral"><Sparkles size={22} strokeWidth={1.5} /></span>
                <h3>Make the moment matter.</h3>
                <p>A little ceremony, a spotlight, a reason to pause and notice what’s happening — because the people at the centre of the day deserve to feel that.</p>
              </article>
              <article className="approach-card" data-reveal style={{ animationDelay: "140ms" }}>
                <span className="approach-card__index">03</span>
                <span className="approach-card__icon approach-card__icon--teal"><span className="approach-card__spark" /></span>
                <h3>Sometimes, add a little magic.</h3>
                <p>A surprise, a flourish, something worth talking about afterward — when it fits.</p>
              </article>
              <article className="approach-card" data-reveal style={{ animationDelay: "210ms" }}>
                <span className="approach-card__index">04</span>
                <span className="approach-card__icon approach-card__icon--ink"><Heart size={20} strokeWidth={1.5} /></span>
                <h3>Leave something behind.</h3>
                <p>The day ends. What matters is what's still true after it does — a little more visibility, a little more dignity, something that outlasts the afternoon itself.</p>
              </article>
            </div>
          </div>
        </section>

        {blogPosts.length > 0 ? (
          <section className="blog-teaser-section section-sand section-space" id="blog">
            <div className="editorial-container">
              <div className="section-heading section-heading--split" data-reveal>
                <div>
                  <p className="eyebrow"><span className="eyebrow__dot" /> From the blog</p>
                  <h2>Notes from inside the work.</h2>
                </div>
                <p className="section-heading__aside">Thinking on CSR, employee experience, and what makes a day worth remembering.</p>
              </div>

              <div className="blog-grid">
                {blogPosts.map((post, index) => (
                  <a href={`/blog/${post.slug}`} key={post.slug} className="blog-card" data-reveal style={{ animationDelay: `${index * 70}ms` }}>
                    {post.coverImage ? <img className="blog-card__photo" src={post.coverImage} alt={post.coverImageAlt || post.title} /> : <div className="blog-card__photo blog-card__photo--placeholder" />}
                    <div className="blog-card__body">
                      <div className="blog-card__meta">
                        {post.category ? <span className="blog-card__category">{post.category}</span> : null}
                        <span className="blog-card__readtime">{post.readTimeMinutes || estimateReadTime(post.content)} min read</span>
                      </div>
                      <h3>{post.title}</h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                    </div>
                  </a>
                ))}
              </div>

              <div className="concept-teaser" data-reveal>
                <a href="/blog" className="button button--ink">Read all posts <ArrowRight size={17} /></a>
              </div>
            </div>
          </section>
        ) : null}

        <section className="cause-section section-teal" data-reveal>
          <div className="cause-section__inner">
            <p className="cause-section__lead">Whatever your team is already working toward — <em>we bring the celebration to it.</em></p>
            <div className="cause-marquee" aria-label="Team Up works across causes">
              <div className="cause-marquee__track">
                {[...causeTags, ...causeTags].map((cause, index) => (
                  <span className="cause-tag" key={`${cause}-${index}`}><span className="cause-tag__dot" />{cause}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section section-ink" id="contact">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="contact-layout">
              <div className="contact-copy" data-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Your next occasion</p>
                <h2>Let’s create something<br /><em>worth remembering.</em></h2>
                <p>Tell us what you’re already planning, and we’ll bring the celebration. Or tell us your budget and your cause, and we’ll bring you the idea.</p>
                <p className="contact-copy__note">A first conversation is just that — a conversation.</p>
              </div>
              <form className="contact-form" onSubmit={handleSubmit} data-reveal style={{ animationDelay: "100ms" }}>
                <label>
                  <span>Your name</span>
                  <input name="name" placeholder="How should we call you?" required />
                </label>
                <label>
                  <span>Work email</span>
                  <input name="email" type="email" placeholder="you@company.com" required />
                </label>
                <label>
                  <span>Tell us a little</span>
                  <textarea name="message" rows={3} placeholder="What are you already planning?" required />
                </label>
                <button type="submit" className="button button--coral" disabled={submitting}>{submitting ? "Sending…" : "Start a conversation"} <ArrowRight size={17} /></button>
                <p className="contact-form__fineprint">Short form, low pressure. We'll get back to you soon.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper">
        <div className="editorial-container">
          <div className="site-footer__top">
            <div>
              <a className="brand-link brand-link--footer" href="#top" aria-label="Back to top"><TeamUpLogo /></a>
              <p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p>
            </div>
            <div className="site-footer__contact">
              <p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p>
              <a href="mailto:info@teamupfoundation.org.in">info@teamupfoundation.org.in</a>
              <div className="site-footer__socials"><a href="#contact">Instagram</a><a href="#contact">LinkedIn</a></div>
            </div>
          </div>
          <div className="site-footer__bottom">
            <span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span>
            <span>Celebration, not charity.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
