/**
 * Team Up Civic Editorial How We Celebrate page: the quiet, honest chapter of the site.
 * It deliberately uses fewer images, a smaller hero scale, and a clear always/sometimes
 * distinction so celebration is explained without promising spectacle.
 */

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Check, Menu, MessageCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";

const alwaysItems = [
  "A story for the day, thought through before it begins",
  "A moment that’s treated as significant, not routine",
  "Real photos and video afterward, telling that same story",
];

const sometimesItems = [
  "A performer, a surprise, a small flourish",
  "Something bigger, for the right occasion",
];

function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-celebrate-reveal]"));
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

export default function HowWeCelebrate() {
  useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast("Your conversation is ready to begin.", { description: "Connect the form to the preferred inbox before launch." });
  };

  const handleWhatsApp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    toast("Add the official WhatsApp number here before launch.", { description: "The lower-friction conversation path is ready in the design." });
  };

  return (
    <div className="celebrate-page">
      <header className="site-header celebrate-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/how-we-celebrate" className="nav-current">How we celebrate</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="celebrate-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}<span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="celebrate-mobile-navigation" className={`mobile-nav ${mobileOpen ? "celebrate-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
          <a href="#inquiry" onClick={() => setMobileOpen(false)}>Start a conversation <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="celebrate-hero section-paper">
          <div className="editorial-container celebrate-hero__inner" data-celebrate-reveal>
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / How we celebrate</p>
            <h1>How we<br /><em>celebrate.</em></h1>
            <p>Not confetti for the sake of it. Not a production for its own sake. Just moments worth remembering — thought through properly, and told well.</p>
            <BuntingDivider />
            <a href="#meaning" className="arrow-link">What it means here <ArrowDownRight size={18} /></a>
          </div>
          <span className="celebrate-hero__chapter">04 <span>/</span> 06</span>
        </section>

        <section className="celebrate-meaning section-ink" id="meaning" data-celebrate-reveal>
          <div className="editorial-container celebrate-meaning__inner">
            <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> What celebration means here</p>
            <h2>Celebration doesn’t<br />always look like <em>a party.</em></h2>
            <p>Sometimes it’s loud — a performance, a crowd, a reason to cheer. Sometimes it’s quiet — an afternoon at an elder care home, an old memory surfacing, a moment nobody quite expected. Both are celebrations, as far as we’re concerned. What makes something a celebration isn’t how big it looks. It’s whether it becomes something worth telling — to your team, to your family, to yourself later, remembering it.</p>
            <BuntingDivider light />
          </div>
        </section>

        <section className="celebrate-story section-paper section-space" id="story">
          <div className="editorial-container">
            <div className="celebrate-story__heading" data-celebrate-reveal>
              <p className="eyebrow"><span className="eyebrow__dot" /> How it actually happens</p>
              <h2>Every day starts<br /><em>with a story.</em></h2>
            </div>
            <div className="celebrate-story__layout">
              <div className="celebrate-story__copy" data-celebrate-reveal>
                <p>Before anything happens, we sit down with you and decide what this day is actually about. That story — not just a list of activities — is what gets handed to everyone involved: the team on the ground, whoever’s capturing it, everyone. So the day has a shape to it, not just a sequence of tasks ticked off.</p>
                <a className="arrow-link" href="/experiences">See the experiences we’ve shaped <ArrowRight size={18} /></a>
              </div>
              <figure className="celebrate-story__image" data-celebrate-reveal>
                <img src="/images/team-up-hero.jpg" alt="People and community gathering during a warm Team Up celebration" />
                <figcaption><span>Before the day begins.</span><span>With people and place in mind.</span></figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="celebrate-small-moment section-sand" data-celebrate-reveal>
          <div className="editorial-container celebrate-small-moment__inner">
            <p className="eyebrow"><span className="eyebrow__dot" /> The small moments</p>
            <h2>We make the<br /><em>moment matter.</em></h2>
            <p>A pause to notice what’s actually happening. A small way of saying this mattered, to the people it mattered to most. It doesn’t need to be elaborate. It needs to be genuine.</p>
          </div>
        </section>

        <section className="celebrate-expectations section-paper section-space" id="expectations">
          <div className="editorial-container">
            <div className="celebrate-expectations__heading" data-celebrate-reveal>
              <p className="eyebrow"><span className="eyebrow__dot" /> Honest expectations</p>
              <h2>What you can<br /><em>always count on.</em></h2>
              <p>We’ll always tell you plainly what’s included before you commit to anything. No surprises, in either direction.</p>
            </div>
            <div className="expectation-grid">
              <article className="expectation-card expectation-card--always" data-celebrate-reveal>
                <div className="expectation-card__header"><span className="expectation-card__index">01 / THE PROMISE</span><span className="expectation-card__mark"><Check size={16} /></span><h3>Always part of it</h3></div>
                <ul>{alwaysItems.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
              </article>
              <article className="expectation-card expectation-card--sometimes" data-celebrate-reveal>
                <div className="expectation-card__header"><span className="expectation-card__index">02 / THE POSSIBILITY</span><span className="expectation-card__mark"><Plus size={16} /></span><h3>Sometimes, if it fits</h3></div>
                <ul>{sometimesItems.map((item) => <li key={item}><Plus size={15} />{item}</li>)}</ul>
              </article>
            </div>
          </div>
        </section>

        <section className="celebrate-cta section-ink" id="inquiry">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="celebrate-cta__layout">
              <div className="celebrate-cta__copy" data-celebrate-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Your next conversation</p>
                <h2>Want to talk through<br /><em>what this could look like?</em></h2>
                <p>Bring us the cause, the team, or even the roughest first thought. We’ll help shape what comes next.</p>
              </div>
              <form className="celebrate-inquiry" onSubmit={handleSubmit} data-celebrate-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <button type="submit" className="button button--coral">Send us an inquiry <ArrowRight size={17} /></button>
                <a className="whatsapp-button" href="#inquiry" onClick={handleWhatsApp}><MessageCircle size={18} strokeWidth={1.5} /> Chat with us on WhatsApp</a>
                <p className="celebrate-inquiry__fineprint">Short form, low pressure. This prototype does not send submissions yet.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper celebrate-footer">
        <div className="editorial-container">
          <div className="site-footer__top"><div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div><div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:hello@teamup.org">hello@teamup.org</a><div className="site-footer__socials"><a href="#inquiry">Instagram</a><a href="#inquiry">LinkedIn</a></div></div></div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}
