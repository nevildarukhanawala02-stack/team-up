/**
 * Team Up Civic Editorial page: a warm, asymmetrical, documentary-led homepage that treats
 * celebration as a dignified signal of attention. Copy follows the supplied framework; images
 * are intentionally replaceable generated placeholders until approved real event photography arrives.
 */

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Camera,
  Menu,
  MoveUpRight,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";

const proofStories = [
  {
    number: "01",
    title: "The Beat That Traveled",
    subtitle: "Dharavi Hip-Hop Kids",
    text: "A group of young dancers from Dharavi got the stage — and the city — their talent always deserved. One video of the day crossed 500,000 views, entirely on its own.",
    image: "/images/team-up-proof-dancers.jpg",
    alt: "Young dancers performing outdoors in an urban Mumbai setting",
    color: "coral",
    proof: "500,000 organic views",
  },
  {
    number: "02",
    title: "Colors on the Ward",
    subtitle: "Cancer Ward Art Competition",
    text: "Kids on a hospital ward spent an afternoon as artists, not patients. Every single one went home a winner.",
    image: "/images/team-up-proof-art.jpg",
    alt: "Children creating paintings together in a bright common room",
    color: "teal",
    proof: "Every one went home a winner",
  },
  {
    number: "03",
    title: "Christmas for Three Hundred",
    subtitle: "Juhu Christmas Event",
    text: "Santa, a tree, and a celebration for 300 children who don’t always get one. A simple, full-hearted day.",
    image: "/images/team-up-proof-christmas.jpg",
    alt: "Children gathering around a modest Christmas celebration",
    color: "gold",
    proof: "A full-hearted day for 300 children",
  },
];

const causeTags = ["Education", "Environment", "Health", "Women’s empowerment", "Whatever your cause"];

function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
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
  }, []);
}

export default function Home() {
  useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast("The conversation path is ready for your preferred email or form destination.", {
      description: "This visual prototype does not send submissions yet.",
    });
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
            <a href="/how-we-celebrate">How we celebrate</a>
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
          <a href="/how-we-celebrate" onClick={closeMenu}>How we celebrate <ArrowRight size={16} /></a>
          <a href="/contact" onClick={closeMenu}>Contact us <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section section-paper">
          <div className="hero-section__inner editorial-container">
            <div className="hero-copy" data-reveal>
              <h1 className="hero-message"><span>We turn CSR employee</span><span>activities into</span><em>moments people remember.</em></h1>
              <p className="hero-lede">
                The same cause, the same budget — shaped into a day your employees and communities will carry with them.
              </p>
              <BuntingDivider />
              <div className="hero-actions">
                <a href="#proof" className="button button--ink">See what we’ve built <ArrowDownRight size={17} /></a>
                <a href="#contact" className="text-link">Start a conversation <ArrowRight size={17} /></a>
              </div>
              <p className="hero-footnote">Celebration, not charity <span>·</span> same cause <span>·</span> same budget.</p>
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

            <div className="proof-footnote" data-reveal>
              <Camera size={18} strokeWidth={1.5} />
              <span>Placeholder visuals for this prototype — real event photography should replace them before launch.</span>
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
            </div>
          </div>
        </section>

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
                <button type="submit" className="button button--coral">Start a conversation <ArrowRight size={17} /></button>
                <p className="contact-form__fineprint">Prototype form — connect the preferred inbox before launch.</p>
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
              <a href="mailto:hello@teamup.org">hello@teamup.org</a>
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
