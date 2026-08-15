/**
 * Team Up Civic Editorial About page: a quiet trust chapter after the homepage and Experiences.
 * Named people use neutral initials placeholders only until approved real photographs are supplied;
 * no synthetic portraits are used. Copy marked as draft in the framework remains visibly provisional.
 */

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Download, FileCheck2, Menu, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";

const trustees: { initials: string; name: string; bio: string; color: string; photo?: string; photoAlt?: string }[] = [
  {
    initials: "ND",
    name: "Nevil Darukhanawala",
    photo: "/images/nevil-darukhanawala.jpg",
    photoAlt: "Nevil Darukhanawala, Trustee, Team Up",
    bio: "Nevil brings over two decades of entrepreneurial experience across web technology and business systems, most recently as founder of StartupAIAdvantage, building AI-driven automation systems that help startups and manufacturing and logistics businesses run smarter. That same systems-thinking — building things that scale without losing their heart — is what shaped how Team Up operates behind the scenes.",
    color: "gold",
  },
  {
    initials: "AK",
    name: "Arvind Kukreti",
    bio: "Arvind co-founded Ginger Domain, a Mumbai-based digital agency that has spent close to two decades building websites, ecommerce platforms, and digital marketing for businesses across India and beyond. That hands-on understanding of how stories travel online is what shapes how Team Up shows up on screen.",
    color: "teal",
  },
];

function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-about-reveal]"));
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

export default function About() {
  useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleCertificate = (label: string) => {
    toast(`${label} is ready for the final certificate file.`, {
      description: "The download path is a placeholder until the approved PDF is supplied.",
    });
  };

  return (
    <div className="about-page">
      <header className="site-header about-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about" className="nav-current">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="about-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="about-mobile-navigation" className={`mobile-nav ${mobileOpen ? "about-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
          <a href="#inquiry" onClick={() => setMobileOpen(false)}>Start a conversation <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="about-hero section-paper">
          <div className="about-hero__image" aria-hidden="true" />
          <div className="editorial-container about-hero__inner" data-about-reveal>
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / About us</p>
            <h1>About<br /><em>Team Up.</em></h1>
            <p>Two trustees, one shared belief: that doing good doesn’t have to look ordinary — impact can be exactly as memorable as it is meaningful.</p>
            <BuntingDivider />
            <a href="#why-we-exist" className="arrow-link">Why we exist <ArrowDownRight size={18} /></a>
          </div>
          <span className="about-hero__chapter">03 <span>/</span> 06</span>
        </section>

        <section className="about-origin section-ink" id="why-we-exist" data-about-reveal>
          <div className="editorial-container about-origin__inner">
            <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Why we exist</p>
            <p className="about-origin__copy">Team Up started with three real afternoons — a hospital ward turned art studio, young dancers from Dharavi who found a bigger stage, a Christmas that felt like family for 300 kids. We didn’t set out with a theory. We noticed, after the fact, that celebration works better than charity — and built an organization around doing it properly, every time.</p>
            <a className="about-origin__link" href="/experiences">See the full stories <ArrowRight size={17} /></a>
            <BuntingDivider light />
          </div>
        </section>

        <section className="trustees-section section-paper section-space" id="people">
          <div className="editorial-container">
            <div className="about-section-heading" data-about-reveal>
              <p className="eyebrow"><span className="eyebrow__dot" /> The people</p>
              <h2>Two different directions.<br /><em>One shared instinct.</em></h2>
              <p>Run by two trustees who came at this from very different directions.</p>
            </div>
            <div className="trustee-grid">
              {trustees.map((trustee, index) => (
                <article className={`trustee-card trustee-card--${trustee.color}`} key={trustee.name} data-about-reveal style={{ animationDelay: `${index * 90}ms` }}>
                  {trustee.photo ? (
                    <div className="trustee-card__photo trustee-card__photo--real"><img src={trustee.photo} alt={trustee.photoAlt ?? trustee.name} /></div>
                  ) : (
                    <div className="trustee-card__photo" aria-label={`${trustee.name} photograph placeholder`}><span>{trustee.initials}</span><small>Real photograph required</small></div>
                  )}
                  <div className="trustee-card__body">
                    <p className="trustee-card__role">Trustee, Team Up</p>
                    <h3>{trustee.name}</h3>
                    <p>{trustee.bio}</p>
                    <span className="trustee-card__rule" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
            <p className="trustee-closing" data-about-reveal>Two different paths, one shared instinct: that celebration is a more powerful force for good than charity ever was.</p>
            <p className="about-draft-note" data-about-reveal>Trustee biographies are a first draft for review and direct verification before publication.</p>
          </div>
        </section>

        <section className="credentials-section section-sand section-space" id="credentials">
          <div className="editorial-container">
            <div className="credentials-layout" data-about-reveal>
              <div className="credentials-copy">
                <p className="eyebrow"><span className="eyebrow__dot" /> Trust & credentials</p>
                <h2>Quietly<br /><em>reassuring.</em></h2>
                <p>We’re a fully registered NGO, holding provisional 12A and 80G certification — which means your contribution or partnership is on solid legal footing from day one.</p>
              </div>
              <div className="credentials-downloads">
                <button type="button" className="certificate-link" onClick={() => handleCertificate("Registration certificate")}><span className="certificate-link__icon"><Download size={17} /></span><span><b>Download our registration certificate</b><small>PDF placeholder</small></span><ArrowRight size={17} /></button>
                <button type="button" className="certificate-link" onClick={() => handleCertificate("12A / 80G certificate")}><span className="certificate-link__icon"><FileCheck2 size={17} /></span><span><b>Download our 12A/80G certificate</b><small>PDF placeholder</small></span><ArrowRight size={17} /></button>
              </div>
            </div>
            <div className="completion-certificate" data-about-reveal>
              <FileCheck2 size={28} strokeWidth={1.25} />
              <div><p className="completion-certificate__label">After every event</p><p>you get a completion certificate — the standard documentation your team needs for CSR reporting, sitting alongside the real story and content from the day.</p></div>
            </div>
          </div>
        </section>

        <section className="about-cta section-ink" id="inquiry">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="about-cta__layout">
              <div className="about-cta__copy" data-about-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Keep the conversation going</p>
                <h2>Want to know more,<br /><em>or ready to start?</em></h2>
                <p>Tell us what you’re already thinking. We’ll bring the questions, the shape, and the celebration.</p>
              </div>
              <form className="about-inquiry" onSubmit={handleSubmit} data-about-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <button type="submit" className="button button--coral">Send us an inquiry <ArrowRight size={17} /></button>
                <a className="whatsapp-button" href="#inquiry" onClick={handleWhatsApp}><MessageCircle size={18} strokeWidth={1.5} /> Chat with us on WhatsApp</a>
                <p className="about-inquiry__fineprint">Short form, low pressure. This prototype does not send submissions yet.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper about-footer">
        <div className="editorial-container">
          <div className="site-footer__top"><div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div><div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:hello@teamup.org">hello@teamup.org</a><div className="site-footer__socials"><a href="#inquiry">Instagram</a><a href="#inquiry">LinkedIn</a></div></div></div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}
