/**
 * Team Up Civic Editorial Contact page: the simplest page in the system and the clearest doorway
 * into a conversation. It intentionally has no imagery and keeps the shared form short, calm,
 * and reusable in spirit across the other page CTAs.
 */

import { useEffect, useState } from "react";
import { ArrowRight, Check, Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { submitContactForm } from "@/lib/api";

function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-contact-reveal]"));
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

export default function Contact() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useReveal();

  useEffect(() => {
    document.title = "Contact Team Up — Start a conversation";
    return () => { document.title = "Team Up — Celebration, not charity."; };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    const result = await submitContactForm({
      name: String(data.get("name") || ""),
      organization: String(data.get("organization") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("thought") || ""),
      source: "contact_page",
    });
    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
      toast("Thanks — we’ve got it.", { description: "We’ll be in touch soon." });
    } else {
      toast("Something went wrong.", { description: result.error });
    }
  };

  const handleWhatsApp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    toast("Add the official WhatsApp number here before launch.", { description: "The lower-friction conversation path is ready in the design." });
  };

  return (
    <div className="contact-page">
      <header className="site-header contact-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/blog">Blog</a>
            <a href="/partner">Partner with us</a>
            <a href="/contact" className="nav-cta nav-current">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="contact-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}<span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="contact-mobile-navigation" className={`mobile-nav ${mobileOpen ? "contact-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/blog" onClick={() => setMobileOpen(false)}>Blog <ArrowRight size={16} /></a>
          <a href="/partner" onClick={() => setMobileOpen(false)}>Partner with us <ArrowRight size={16} /></a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="contact-page-intro section-paper" data-contact-reveal>
          <div className="editorial-container contact-page-intro__inner">
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / Contact us</p>
            <h1>Let’s create<br /><em>something worth remembering.</em></h1>
            <p>Whatever you’re already planning, or whatever’s still just an idea — tell us a little, and we’ll take it from there.</p>
            <BuntingDivider />
          </div>
        </section>

        <section className="contact-page-form-section section-paper" data-contact-reveal>
          <div className="editorial-container contact-page-form-layout">
            <div className="contact-page-form-intro">
              <p className="eyebrow"><span className="eyebrow__dot" /> Start here</p>
              <h2>A short note<br /><em>is enough.</em></h2>
              <p>No dropdowns. No long brief required. Just the starting point you have, in your own words.</p>
            </div>
            {submitted ? (
              <div className="contact-success" role="status">
                <span className="contact-success__icon"><Check size={22} /></span>
                <p className="eyebrow"><span className="eyebrow__dot" /> Message received</p>
                <h3>Thanks — we’ve got it.</h3>
                <p>We’ll be in touch soon. This prototype confirmation is ready to connect to your final inbox.</p>
                <button type="button" className="text-button" onClick={() => setSubmitted(false)}>Send another note <ArrowRight size={16} /></button>
              </div>
            ) : (
              <form className="contact-page-form" onSubmit={handleSubmit}>
                <label><span>Name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Email</span><input type="email" name="email" placeholder="Where can we reach you?" required /></label>
                <label><span>Phone <small>optional</small></span><input type="tel" name="phone" placeholder="If you’d prefer a call" /></label>
                <label><span>What are you thinking?</span><textarea name="thought" rows={4} placeholder="A rough idea is more than enough" required /></label>
                <button type="submit" className="button button--coral" disabled={submitting}>{submitting ? "Sending…" : "Send inquiry"} <ArrowRight size={17} /></button>
              </form>
            )}
          </div>
        </section>

        <section className="contact-alternative section-sand" data-contact-reveal>
          <div className="editorial-container contact-alternative__inner">
            <div><p className="eyebrow"><span className="eyebrow__dot" /> Or, skip the form</p><h2>Prefer to<br /><em>just chat?</em></h2></div>
            <a className="contact-whatsapp" href="#contact" onClick={handleWhatsApp}><MessageCircle size={21} strokeWidth={1.45} /><span><b>Message us on WhatsApp</b><small>Lower friction, same conversation.</small></span><ArrowRight size={18} /></a>
          </div>
        </section>

        <section className="contact-details section-paper" data-contact-reveal>
          <div className="editorial-container contact-details__inner">
            <p className="eyebrow"><span className="eyebrow__dot" /> Direct details</p>
            <div className="contact-details__items">
              <a href="mailto:info@teamupfoundation.org.in"><Mail size={18} strokeWidth={1.45} /><span><small>Email</small><b>info@teamupfoundation.org.in</b></span></a>
              <div><Phone size={18} strokeWidth={1.45} /><span><small>Phone</small><b>Available on request</b></span></div>
              <div><span className="contact-pin">●</span><span><small>Based in</small><b>Mumbai, Maharashtra</b></span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper contact-footer">
        <div className="editorial-container">
          <div className="site-footer__top"><div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div><div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:info@teamupfoundation.org.in">info@teamupfoundation.org.in</a><div className="site-footer__socials"><a href="/stories">Our stories</a><a href="/about">About us</a></div></div></div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}
