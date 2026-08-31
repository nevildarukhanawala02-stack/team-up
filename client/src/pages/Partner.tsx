/**
 * Team Up Partner page: three doors in one place, Donate, Volunteer, and
 * Partner, each its own section with a jump-nav at the top. Donate is
 * informational plus a contact-form lead capture (no payment gateway yet,
 * per direction). Volunteer captures structured extras (city, skills,
 * availability) into contact_submissions.metadata. Partner reuses the same
 * CSR pitch as the rest of the site, leading with visible employee
 * involvement as the differentiator CSR heads specifically value.
 */

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { useScrolled } from "@/hooks/useScrolled";
import { submitContactForm } from "@/lib/api";

function useReveal(deps: React.DependencyList = []) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-partner-reveal]:not(.is-visible)"));
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

const volunteerInterests = ["Event day support", "Skilled volunteering", "Mentoring", "Content and storytelling"];

export default function Partner() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  useReveal();

  const [donateSubmitting, setDonateSubmitting] = useState(false);
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  };

  const handleDonateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setDonateSubmitting(true);
    const result = await submitContactForm({
      name: String(data.get("name") || ""),
      email: String(data.get("contact") || ""),
      message: String(data.get("message") || ""),
      source: "donate_inquiry",
      sourceDetail: "Partner page, Donate section",
    });
    setDonateSubmitting(false);
    if (result.success) {
      toast("Thanks, we've got it.", { description: "We'll be in touch soon." });
      form.reset();
    } else {
      toast("Something went wrong.", { description: result.error });
    }
  };

  const handleVolunteerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setVolunteerSubmitting(true);
    const result = await submitContactForm({
      name: String(data.get("name") || ""),
      email: String(data.get("contact") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
      source: "volunteer_signup",
      sourceDetail: "Partner page, Volunteer section",
      metadata: {
        city: String(data.get("city") || ""),
        availability: String(data.get("availability") || ""),
        interests: selectedInterests.join(", "),
      },
    });
    setVolunteerSubmitting(false);
    if (result.success) {
      toast("Thanks, you're on the list.", { description: "We'll reach out when there's a fit." });
      form.reset();
      setSelectedInterests([]);
    } else {
      toast("Something went wrong.", { description: result.error });
    }
  };

  const handlePartnerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setPartnerSubmitting(true);
    const result = await submitContactForm({
      name: String(data.get("name") || ""),
      organization: String(data.get("organization") || ""),
      email: String(data.get("contact") || ""),
      message: String(data.get("message") || ""),
      source: "partner_inquiry",
      sourceDetail: "Partner page, Partner section",
    });
    setPartnerSubmitting(false);
    if (result.success) {
      toast("Thanks, we've got it.", { description: "We'll be in touch soon." });
      form.reset();
    } else {
      toast("Something went wrong.", { description: result.error });
    }
  };

  return (
    <div className="partner-page">
      <header className={`site-header experiences-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories">Our stories</a>
            <a href="/blog">Blog</a>
            <a href="/partner" className="nav-current">Partner with us</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="partner-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}<span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="partner-mobile-navigation" className={`mobile-nav ${mobileOpen ? "experiences-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/blog" onClick={() => setMobileOpen(false)}>Blog</a>
          <a href="/partner" onClick={() => setMobileOpen(false)}>Partner with us</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="experiences-hero section-paper">
          <div className="experiences-hero__image" aria-hidden="true" />
          <div className="editorial-container experiences-hero__inner" data-partner-reveal>
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / Partner with us</p>
            <h1 className="hero-message"><span>Three ways</span><span>to be part</span><em>of the work.</em></h1>
            <p>Whether you're a corporate CSR team, an individual who wants to show up in person, or someone with a few rupees and a cause you care about, there's a door here for you.</p>
            <BuntingDivider />
          </div>
          <div className="story-index" aria-label="Section index">
            <div className="editorial-container story-index__inner">
              <span className="story-index__label">Jump to a section</span>
              <a href="#donate">Donate <ArrowDownRight size={14} /></a>
              <a href="#volunteer">Volunteer <ArrowDownRight size={14} /></a>
              <a href="#partner">Partner <ArrowDownRight size={14} /></a>
            </div>
          </div>
        </section>

        {/* --- Donate --- */}
        <section className="experience-cta section-ink" id="donate">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="experience-cta__layout">
              <div className="experience-cta__copy" data-partner-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Donate</p>
                <h2>A donation<br /><em>with a clear job to do.</em></h2>
                <p>Team Up is a registered NGO with provisional 12A and 80G certification. Every rupee goes toward building a specific day for a specific community, never a general fund. Tell us what you'd like to support and we'll walk you through where it goes.</p>
                <p>Prefer to give through a corporate CSR mandate instead? That's the Partner section below, most of what we build is CSR-funded.</p>
              </div>
              <form className="experience-inquiry" onSubmit={handleDonateSubmit} data-partner-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <label><span>What would you like to support?</span><textarea name="message" rows={3} placeholder="A cause, a story you read, or just 'wherever it's needed most'" /></label>
                <button type="submit" className="button button--coral" disabled={donateSubmitting}>{donateSubmitting ? "Sending…" : "Start a conversation"} <ArrowRight size={17} /></button>
                <p className="experience-inquiry__fineprint">We'll follow up directly, there's no online payment on this page yet.</p>
              </form>
            </div>
          </div>
        </section>

        {/* --- Volunteer --- */}
        <section className="experience-cta section-teal" id="volunteer">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="experience-cta__layout">
              <div className="experience-cta__copy" data-partner-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Volunteer</p>
                <h2>Show up<br /><em>in person.</em></h2>
                <p>Some of what we build needs hands, not just budget: event-day support, a skill you're willing to teach for an afternoon, mentoring, or helping tell the story afterward. Tell us what fits and we'll reach out when there's a match.</p>
              </div>
              <form className="experience-inquiry" onSubmit={handleVolunteerSubmit} data-partner-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <label><span>Phone (optional, if different)</span><input name="phone" placeholder="For event-day coordination" /></label>
                <label><span>City</span><input name="city" placeholder="Where are you based?" /></label>
                <fieldset className="volunteer-interests-field">
                  <legend>What are you interested in?</legend>
                  <div className="volunteer-interests">
                    {volunteerInterests.map((interest) => (
                      <button key={interest} type="button" className={`category-filter__pill ${selectedInterests.includes(interest) ? "is-active" : ""}`} onClick={() => toggleInterest(interest)}>{interest}</button>
                    ))}
                  </div>
                </fieldset>
                <label><span>Availability</span><input name="availability" placeholder="Weekends, a few hours a month, flexible…" /></label>
                <label><span>Anything else?</span><textarea name="message" rows={2} placeholder="A skill, an experience, anything we should know" /></label>
                <button type="submit" className="button button--coral" disabled={volunteerSubmitting}>{volunteerSubmitting ? "Sending…" : "Sign up to volunteer"} <ArrowRight size={17} /></button>
                <p className="experience-inquiry__fineprint">Short form, low pressure. We'll reach out when there's a fit.</p>
              </form>
            </div>
          </div>
        </section>

        {/* --- Partner --- */}
        <section className="experience-cta section-ink" id="partner">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="experience-cta__layout">
              <div className="experience-cta__copy" data-partner-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Partner (CSR)</p>
                <h2>Bring your<br /><em>CSR mandate.</em></h2>
                <p>Most CSR partners come to us with a cause already committed to and a "do something with our employees" requirement. We turn that into a day your team actually remembers, with visible employee involvement on the day itself, not just a check written from a distance.</p>
                <p>That's what CSR managers tell us they value most, and it's the thing we lead with in every partnership we design.</p>
              </div>
              <form className="experience-inquiry" onSubmit={handlePartnerSubmit} data-partner-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <label><span>Tell us about your mandate</span><textarea name="message" rows={3} placeholder="Cause, budget range, timeline, whatever you've got" /></label>
                <button type="submit" className="button button--coral" disabled={partnerSubmitting}>{partnerSubmitting ? "Sending…" : "Start a conversation"} <ArrowRight size={17} /></button>
                <p className="experience-inquiry__fineprint">Short form, low pressure. We'll get back to you soon.</p>
              </form>
            </div>
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
