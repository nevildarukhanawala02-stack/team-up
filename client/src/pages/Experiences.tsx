/**
 * Team Up Civic Editorial Experiences page: this is the chapter after the homepage.
 * Real stories use replaceable documentary imagery; idea cards use line icons so unbuilt
 * concepts cannot be mistaken for delivered work. The page keeps the same paper, ink,
 * coral, gold, teal, serif, sans, mono, and bunting vocabulary as the homepage.
 */

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Menu,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { categories, experiences } from "@/data/experiences";


function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-experience-reveal]"));
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
  }, []);
}

export default function Experiences() {
  useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const visibleExperiences = activeCategory === "all" ? experiences : experiences.filter((item) => item.category === activeCategory);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast("Your starting point is captured for the prototype.", {
      description: "Connect the form to the preferred inbox before launch.",
    });
  };

  const handleWhatsApp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    toast("Add the official WhatsApp number here before launch.", {
      description: "The lower-friction conversation path is ready in the design.",
    });
  };

  return (
    <div className="experiences-page">
      <header className="site-header experiences-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}>
            <TeamUpLogo compact />
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences" className="nav-current">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="experiences-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="experiences-mobile-navigation" className={`mobile-nav ${mobileOpen ? "experiences-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="#inquiry" onClick={() => setMobileOpen(false)}>Start a conversation <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="experiences-hero section-paper">
          <div className="experiences-hero__image" aria-hidden="true" />
          <div className="editorial-container experiences-hero__inner" data-experience-reveal>
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / Experiences</p>
            <h1 className="hero-message"><span>Experiences</span><span>that become</span><em>stories.</em></h1>
            <p>Every experience we build turns into something people carry with them — a story they tell in the office, a video they share with their family, a memory that outlasts the day itself.</p>
            <BuntingDivider />
            <a href="#ideas" className="arrow-link">See the experiences <ArrowDownRight size={18} /></a>
          </div>
          <span className="experiences-hero__chapter">02 <span>/</span> 06</span>
        </section>

        <section className="idea-section section-sand section-space" id="ideas">
          <div className="editorial-container">
            <div className="experiences-section-heading experiences-section-heading--ideas" data-experience-reveal>
              <p className="eyebrow"><span className="eyebrow__dot" /> Real work, and what's next</p>
              <h2>A few we’ve lived,<br /><em>and what we’re excited about next.</em></h2>
              <p>The photo cards below are real, delivered days — click through for the full story. Everything else is a starting point, not a fixed package. Tell us what excites you, and we’ll shape it around your team, your cause, and your budget.</p>
            </div>
            <div className="category-filter" role="tablist" aria-label="Filter experiences by category" data-experience-reveal>
              <button type="button" role="tab" aria-selected={activeCategory === "all"} className={`category-filter__pill ${activeCategory === "all" ? "is-active" : ""}`} onClick={() => setActiveCategory("all")}>All</button>
              {categories.map((category) => (
                <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={`category-filter__pill ${activeCategory === category.id ? "is-active" : ""}`} onClick={() => setActiveCategory(category.id)}>{category.label}</button>
              ))}
            </div>
            <div className="idea-grid">
              {visibleExperiences.map((item, index) => {
                if (item.detail) {
                  return (
                    <Link href={`/experiences/${item.slug}`} key={item.slug} className={`idea-card idea-card--${item.color} idea-card--real`} data-experience-reveal style={{ animationDelay: `${(index % 5) * 45}ms` }}>
                      <img className="idea-card__photo" src={item.detail.heroImage} alt={item.detail.heroAlt} />
                      <div className="idea-card__top"><span className="idea-card__number">{String(index + 1).padStart(2, "0")}</span><span className="idea-card__real-badge">Delivered</span></div>
                      <h3>{item.name}</h3>
                      <p>{item.hook}</p>
                      <span className="idea-card__arrow"><ArrowUpRightIcon /></span>
                    </Link>
                  );
                }
                if (item.image) {
                  return (
                    <Link href={`/experiences/${item.slug}`} key={item.slug} className={`idea-card idea-card--${item.color} idea-card--real`} data-experience-reveal style={{ animationDelay: `${(index % 5) * 45}ms` }}>
                      <img className="idea-card__photo" src={item.image} alt={item.imageAlt ?? item.name} />
                      <div className="idea-card__top"><span className="idea-card__number">{String(index + 1).padStart(2, "0")}</span><span className="idea-card__concept-badge">Concept</span></div>
                      <h3>{item.name}</h3>
                      <p>{item.hook}</p>
                      <span className="idea-card__arrow"><ArrowUpRightIcon /></span>
                    </Link>
                  );
                }
                return (
                  <Link href={`/experiences/${item.slug}`} key={item.slug} className={`idea-card idea-card--${item.color}`} data-experience-reveal style={{ animationDelay: `${(index % 5) * 45}ms` }}>
                    <div className="idea-card__top"><span className="idea-card__number">{String(index + 1).padStart(2, "0")}</span></div>
                    <h3>{item.name}</h3>
                    <p>{item.hook}</p>
                    <span className="idea-card__arrow"><ArrowUpRightIcon /></span>
                  </Link>
                );
              })}
            </div>
            <p className="idea-section__note" data-experience-reveal><Sparkles size={16} strokeWidth={1.5} /> Illustrative concepts — never fixed packages.</p>
          </div>
        </section>

        <section className="build-section section-paper section-space" id="build">
          <div className="editorial-container">
            <BuntingDivider />
            <div className="build-heading" data-experience-reveal>
              <p className="eyebrow"><span className="eyebrow__dot" /> Build your own</p>
              <h2>Don’t see it here?<br /><em>Let’s build it together.</em></h2>
              <p>We can’t put every idea on this page — most of the best ones come from a real conversation. Here’s roughly how we think it through with you:</p>
            </div>
            <div className="build-steps">
              <article className="build-step" data-experience-reveal><span>01</span><h3>Start with your cause.</h3><p>Whatever your team is already committed to — education, environment, health, anything else — that’s our starting point too.</p></article>
              <article className="build-step" data-experience-reveal><span>02</span><h3>Pick a shape.</h3><p>A hands-on day where your team gets involved directly, a showcase where a community’s talent takes the stage, a festive touch added to something that’s already happening, or something bigger.</p></article>
              <article className="build-step" data-experience-reveal><span>03</span><h3>Bring us your flavor.</h3><p>A performer, a surprise, a small idea that’s been sitting in your head — if it fits, we’ll find a way to build it in.</p></article>
            </div>
          </div>
        </section>

        <section className="story-method section-teal-tint" data-experience-reveal>
          <div className="editorial-container story-method__inner">
            <p className="eyebrow"><span className="eyebrow__dot" /> How the story gets told</p>
            <h2>That’s what makes it a<br /><em>Team Up experience.</em></h2>
            <p>Before anything happens, we decide together what story the day is actually telling. That story — not just a shot list — is what gets handed to everyone on the ground, from the performers to the camera crew. Everyone shows up already knowing what they’re there to capture and create.</p>
            <BuntingDivider />
          </div>
        </section>

        <section className="experience-cta section-ink" id="inquiry">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="experience-cta__layout">
              <div className="experience-cta__copy" data-experience-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Your starting point</p>
                <h2>Have an idea?<br /><em>Even a rough one is enough.</em></h2>
                <p>Tell us what you’re already thinking. We’ll bring the questions, the shape, and the celebration.</p>
              </div>
              <form className="experience-inquiry" onSubmit={handleSubmit} data-experience-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Your starting point</span><textarea name="thought" rows={3} placeholder="One line about what you’re thinking" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <button type="submit" className="button button--coral">Send us an inquiry <ArrowRight size={17} /></button>
                <a className="whatsapp-button" href="#inquiry" onClick={handleWhatsApp}><MessageCircle size={18} strokeWidth={1.5} /> Chat with us on WhatsApp</a>
                <p className="experience-inquiry__fineprint">Short form, low pressure. This prototype does not send submissions yet.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper experiences-footer">
        <div className="editorial-container">
          <div className="site-footer__top">
            <div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div>
            <div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:hello@teamup.org">hello@teamup.org</a><div className="site-footer__socials"><a href="#inquiry">Instagram</a><a href="#inquiry">LinkedIn</a></div></div>
          </div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={16} strokeWidth={1.5} className="idea-card__arrow-icon" />;
}
