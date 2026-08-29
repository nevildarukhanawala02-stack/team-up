import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, CircleHelp, Compass, Menu, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Link, useParams } from "wouter";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";
import { categories, formats, fetchExperienceFromApi, type Experience } from "@/data/experiences";
import { submitContactForm } from "@/lib/api";
import NotFound from "@/pages/NotFound";

export default function ExperienceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [experience, setExperience] = useState<Experience | null | undefined>(undefined);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setExperience(undefined);
    if (!slug) return;
    fetchExperienceFromApi(slug)
      .then(setExperience)
      .catch(() => setExperience(null));
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    const result = await submitContactForm({
      name: String(data.get("name") || ""),
      organization: String(data.get("organization") || ""),
      email: String(data.get("contact") || ""),
      message: String(data.get("thought") || ""),
      source: "experience_inquiry",
      sourceDetail: experience?.name,
    });
    setSubmitting(false);
    if (result.success) {
      toast("Thanks — we've got it.", { description: "We'll be in touch soon." });
      form.reset();
    } else {
      toast("Something went wrong.", { description: result.error });
    }
  };

  const handleWhatsApp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    toast("Add the official WhatsApp number here before launch.", {
      description: "The lower-friction conversation path is ready in the design.",
    });
  };

  if (experience === undefined) {
    return <div className="idea-grid__loading" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>;
  }

  if (!experience || (!experience.detail && !experience.preview)) {
    return <NotFound />;
  }

  const category = categories.find((item) => item.id === experience.category);
  const format = formats.find((item) => item.id === experience.format);

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
        {experience.detail ? (
          <>
            <section className="hero-section section-paper">
              <div className="hero-section__inner editorial-container">
                <div className="hero-copy">
                  <Link href="/experiences" className="text-link experience-detail__back"><ArrowLeft size={15} strokeWidth={1.7} /> All experiences</Link>
                  <p className="eyebrow"><span className="eyebrow__dot" /> {format ? format.label : ""}{category ? ` · ${category.label}` : ""}</p>
                  <h1 className="hero-message"><span>{experience.name}</span></h1>
                  <p className="hero-lede">{experience.hook}</p>
                </div>
                <div className="hero-visual">
                  <div className="hero-visual__frame">
                    <img src={experience.detail.heroImage} alt={experience.detail.heroAlt} />
                    <div className="hero-visual__wash" />
                    <div className="hero-visual__caption">
                      <span>{experience.detail.proof}</span>
                    </div>
                  </div>
                  {experience.detail.imagePlaceholder ? <p className="experience-detail__placeholder-note"><CircleHelp size={14} strokeWidth={1.6} /> Placeholder image — pending approved event photography.</p> : null}
                </div>
              </div>
              <div className="hero-section__edge" aria-hidden="true" />
            </section>

            <section className="experience-facts section-paper">
              <div className="editorial-container experience-facts__grid">
                <div className="experience-facts__item"><span>Format</span><strong>{format ? format.label : "—"}</strong></div>
                <div className="experience-facts__item"><span>Category</span><strong>{category ? category.label : "—"}</strong></div>
                <div className="experience-facts__item"><span>Delivered with</span><strong>{experience.detail.partner}</strong></div>
                <div className="experience-facts__item"><span>The proof</span><strong>{experience.detail.proof}</strong></div>
              </div>
            </section>

            <section className="experience-brief section-paper">
              <div className="editorial-container experience-brief__grid">
                <div className="experience-brief__block">
                  <p className="experience-brief__label">The story we set out to tell</p>
                  <p>{experience.detail.storyDirection}</p>
                </div>
                <div className="experience-detail__ceremony">
                  <span className="experience-detail__ceremony-label">The ceremony</span>
                  <p>{experience.detail.ceremony}</p>
                </div>
              </div>
              {experience.detail.impact ? (
                <div className="editorial-container">
                  <div className="experience-detail__impact">
                    <span className="experience-detail__impact-label">What outlasted the day</span>
                    <p>{experience.detail.impact}</p>
                  </div>
                </div>
              ) : null}
              <div className="editorial-container">
                <ul className="experience-detail__highlights">
                  {experience.detail.highlights.map((highlight) => (
                    <li key={highlight}><CircleCheck size={16} strokeWidth={1.6} /> {highlight}</li>
                  ))}
                </ul>
              </div>
            </section>

            {experience.detail.gallery.length > 0 ? (
              <section className="experience-thumbnails section-sand">
                <div className="editorial-container experience-thumbnails__grid">
                  {experience.detail.gallery.map((item, index) => (
                    <figure key={item.src}>
                      <img src={item.src} alt={item.alt} />
                      <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{item.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="experience-closing section-paper">
              <div className="editorial-container experience-closing__inner">
                <Link href={`/stories#${experience.detail.storyLink}`} className="text-link">Read the full story <ArrowRight size={15} strokeWidth={1.7} /></Link>
                {experience.detail.pressLinks && experience.detail.pressLinks.length > 0 ? (
                  <div className="experience-detail__press">
                    <span className="experience-detail__press-label">As seen in</span>
                    {experience.detail.pressLinks.map((press) => (
                      <a key={press.url} href={press.url} target="_blank" rel="noreferrer" className="text-link">{press.source}</a>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="hero-section section-paper concept-hero">
              <div className="hero-section__inner editorial-container">
                <div className="hero-copy">
                  <Link href="/experiences" className="text-link experience-detail__back"><ArrowLeft size={15} strokeWidth={1.7} /> All experiences</Link>
                  <p className="eyebrow"><span className="eyebrow__dot" /> {format ? format.label : ""}{category ? ` · ${category.label}` : ""}</p>
                  <h1 className="hero-message"><span>{experience.name}</span></h1>
                  <p className="hero-lede">{experience.hook}</p>
                  <p className="concept-hero__flag"><Compass size={14} strokeWidth={1.7} /> A starting point, not a fixed package — nothing here has happened yet.</p>
                </div>
                <div className="hero-visual concept-hero__visual">
                  <div className="hero-visual__frame">
                    {experience.image ? <img src={experience.image} alt={experience.imageAlt ?? experience.name} /> : null}
                    <div className="hero-visual__wash" />
                    <div className="hero-visual__caption">
                      <span className="idea-card__concept-badge">Concept — illustrative, not documentary</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-section__edge" aria-hidden="true" />
            </section>

            <section className="story-panel story-panel--narrative section-paper">
              <div className="editorial-container story-narrative__inner">
                <p className="eyebrow"><span className="eyebrow__dot" /> A possible shape for this day</p>
                <div className="story-narrative__copy">
                  <h3>What this<br /><em>could look like.</em></h3>
                  <p>{experience.preview!.description}</p>
                </div>
                <ul className="experience-detail__highlights experience-detail__highlights--concept">
                  {experience.preview!.possibleElements.map((element) => (
                    <li key={element}><Compass size={16} strokeWidth={1.6} /> {element}</li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}

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
                <label><span>Your starting point</span><textarea name="thought" rows={3} defaultValue={`I'm interested in: ${experience.name}`} required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <button type="submit" className="button button--coral" disabled={submitting}>{submitting ? "Sending…" : "Send us an inquiry"} <ArrowRight size={17} /></button>
                <a className="whatsapp-button" href="#inquiry" onClick={handleWhatsApp}><MessageCircle size={18} strokeWidth={1.5} /> Chat with us on WhatsApp</a>
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
            <div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:info@teamupfoundation.org.in">info@teamupfoundation.org.in</a><div className="site-footer__socials"><a href="#inquiry">Instagram</a><a href="#inquiry">LinkedIn</a></div></div>
          </div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}
