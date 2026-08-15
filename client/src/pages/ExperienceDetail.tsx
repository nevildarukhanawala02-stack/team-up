import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, Menu, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Link, useParams } from "wouter";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { categories, experiences } from "@/data/experiences";
import NotFound from "@/pages/NotFound";

export default function ExperienceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const experience = experiences.find((item) => item.slug === slug);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  // Concept cards (no `detail`) don't have a page yet — fall back cleanly rather than 404 on real slugs mistyped.
  if (!experience || !experience.detail) {
    return <NotFound />;
  }

  const { detail } = experience;
  const category = categories.find((item) => item.id === experience.category);

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
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="experience-detail-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="experience-detail-mobile-navigation" className={`mobile-nav ${mobileOpen ? "experiences-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="#inquiry" onClick={() => setMobileOpen(false)}>Start a conversation <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="hero-section section-paper">
          <div className="hero-section__inner editorial-container">
            <div className="hero-copy">
              <Link href="/experiences" className="text-link experience-detail__back"><ArrowLeft size={15} strokeWidth={1.7} /> All experiences</Link>
              {category ? <p className="eyebrow"><span className="eyebrow__dot" /> {category.label}</p> : null}
              <h1 className="hero-message"><span>{experience.name}</span></h1>
              <p className="hero-lede">{experience.hook}</p>
            </div>
            <div className="hero-visual">
              <div className="hero-visual__frame">
                <img src={detail.heroImage} alt={detail.heroAlt} />
                <div className="hero-visual__wash" />
                <div className="hero-visual__caption">
                  <span>{detail.proof}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-section__edge" aria-hidden="true" />
        </section>

        <section className="story-panel story-panel--narrative section-paper">
          <div className="editorial-container story-narrative__inner">
            <p className="eyebrow"><span className="eyebrow__dot" /> Delivered with {detail.partner}</p>
            <div className="story-narrative__copy">
              <h3>How it<br /><em>came together.</em></h3>
              <p>{detail.overview}</p>
            </div>
            <ul className="experience-detail__highlights">
              {detail.highlights.map((highlight) => (
                <li key={highlight}><CircleCheck size={16} strokeWidth={1.6} /> {highlight}</li>
              ))}
            </ul>
          </div>
        </section>

        {detail.gallery.length > 0 ? (
          <section className="story-panel story-panel--gallery section-sand">
            <div className="editorial-container">
              <div className={detail.gallery.length === 1 ? "experience-detail__gallery-single" : "story-gallery-grid"}>
                {detail.gallery.map((item, index) => (
                  <figure key={item.src} className={`story-gallery-frame story-gallery-frame--${index + 1}`}>
                    <img src={item.src} alt={item.alt} />
                    <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="story-panel story-panel--moment section-teal">
          <div className="editorial-container story-moment__inner">
            <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> The proof</p>
            <blockquote>“{detail.proof}”</blockquote>
            <BuntingDivider light />
            <Link href={`/stories#${detail.storyLink}`} className="text-link text-link--light">Read the full story <ArrowRight size={15} strokeWidth={1.7} /></Link>
          </div>
        </section>

        <section className="experience-cta section-ink" id="inquiry">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="experience-cta__layout">
              <div className="experience-cta__copy">
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> Want something like this?</p>
                <h2>Let's shape it<br /><em>around your team.</em></h2>
                <p>Every experience here started as a rough idea. Tell us what you're thinking, and we'll bring the questions, the shape, and the celebration.</p>
              </div>
              <form className="experience-inquiry" onSubmit={handleSubmit}>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Your starting point</span><textarea name="thought" rows={3} placeholder="One line about what you're thinking" required /></label>
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
