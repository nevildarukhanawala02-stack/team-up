/**
 * Team Up Civic Editorial Our Stories archive: a slower, magazine-style experience after the
 * compact Experiences previews. Story media is intentionally replaceable; the current image set
 * is clearly marked as prototype scaffolding until approved event photography and video arrive.
 * Panel D renders only when an approved video source is supplied, never as an empty player.
 */

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, Camera, CirclePlay, Menu, MessageCircle, X } from "lucide-react";
import { toast } from "sonner";
import { BuntingDivider, TeamUpLogo } from "@/components/TeamUpBrand";

type Story = {
  id: string;
  number: string;
  title: string;
  scene: string;
  image: string;
  alt: string;
  story: string;
  moment: string;
  proof: string;
  galleryCaptions: string[];
  galleryImages?: string[];
  videoSrc?: string;
  accent: "coral" | "gold" | "teal";
  galleryStyle: "evidence" | "timeline" | "closeups" | "festival";
};

const stories: Story[] = [
  {
    id: "beat-that-traveled",
    number: "01",
    title: "The Beat That Traveled",
    scene: "A group of young dancers from Dharavi took their moves out of their neighborhood — and onto Mumbai’s biggest stages.",
    image: "/images/dharavi-dreams-hero.jpg",
    alt: "Young performers mid-jump under red stage lighting during Dharavi Dreams, a hip-hop theatre production",
    story: "We partnered with Rahi Theatre Collaboration and The Dharavi Dream Project on Dharavi Dreams — India’s first musical hip-hop theatre production, written and directed by Neha Singh. Thirteen teenage hip-hop artists from Dharavi took the stage in specially made Sooper Dooper Kids t-shirts, in front of a real audience who came for the show, not the cause. What happened next wasn’t something we planned — it just happened, because the story underneath it was already true.",
    moment: "One video. Over 500,000 people. Zero paid promotion.",
    proof: "500K+ organic views",
    galleryCaptions: ["Warming up", "Into the light", "A real audience", "The beat carries"],
    galleryImages: [
      "/images/dharavi-dreams-warmup.jpg",
      "/images/dharavi-dreams-light.jpg",
      "/images/dharavi-dreams-cast.jpg",
      "/images/dharavi-dreams-energy.jpg",
    ],
    accent: "coral",
    galleryStyle: "evidence",
  },
  {
    id: "colors-on-the-ward",
    number: "02",
    title: "Colors on the Ward",
    scene: "For one afternoon, a hospital ward became an art studio — and every child in it became an artist first.",
    image: "/images/access-life-hero.jpg",
    alt: "A group of children in matching Little Rockstars t-shirts posing together with a parent",
    story: "The story we wanted to tell here wasn’t about a competition or a winner. It was about a room forgetting, just for a while, where it was. Every child who picked up a brush that day left as a winner — a Sooper Dooper Kids t-shirt and, more than that, an afternoon that looked nothing like the rest of their week.",
    moment: "Every single participant. A winner.",
    proof: "A room that forgot where it was",
    galleryCaptions: ["The first brushstroke", "Colour in focus", "A small masterpiece", "Artists first"],
    galleryImages: [
      "/images/access-life-brushstroke.jpg",
      "/images/access-life-colour.jpg",
      "/images/access-life-masterpiece.jpg",
      "/images/access-life-artists-first.jpg",
    ],
    accent: "teal",
    galleryStyle: "closeups",
  },
  {
    id: "independence-day-childrens-festival",
    number: "03",
    title: "Independence Day Children's Festival",
    scene: "A banquet hall, hundreds of kids, and a full-scale Independence Day celebration we showed up to be part of.",
    image: "/images/giving-tree-hero.jpg",
    alt: "A large hall full of children celebrating together under chandeliers",
    story: "We joined Giving Tree Foundation and Way of Hope Charitable Trust's Independence Day Children's Festival, held in a Mumbai banquet hall complete with costumed mascots, music, and hundreds of children. We didn't organize the day — we showed up as participants, the same way we believe every brand should. Every child who came through the door left in a specially donated Sooper Dooper Kids t-shirt, one small, tangible piece of the celebration to carry home.",
    moment: "Hundreds of children. One shared Independence Day.",
    proof: "A banquet hall full of children, celebrating together",
    galleryCaptions: ["A new friend arrives", "Independence Day energy", "One festival, matching colours", "Friends first"],
    galleryImages: [
      "/images/giving-tree-mascot.jpg",
      "/images/giving-tree-energy.jpg",
      "/images/giving-tree-festival.jpg",
      "/images/giving-tree-friends.jpg",
    ],
    accent: "coral",
    galleryStyle: "festival",
  },
];

function useReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-story-reveal]"));
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

export default function OurStories() {
  useReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast("Your next story starts with a conversation.", { description: "Connect the form to the preferred inbox before launch." });
  };

  const handleWhatsApp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    toast("Add the official WhatsApp number here before launch.", { description: "The lower-friction conversation path is ready in the design." });
  };

  return (
    <div className="stories-page">
      <header className="site-header stories-header">
        <div className="site-header__inner">
          <a className="brand-link" href="/" aria-label="Team Up home" onClick={() => setMobileOpen(false)}><TeamUpLogo compact /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="/experiences">Experiences</a>
            <a href="/about">About us</a>
            <a href="/stories" className="nav-current">Our stories</a>
            <a href="/how-we-celebrate">How we celebrate</a>
            <a href="/contact" className="nav-cta">Contact us <ArrowRight size={15} strokeWidth={1.7} /></a>
          </nav>
          <button className="mobile-menu-button" type="button" aria-expanded={mobileOpen} aria-controls="stories-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}<span className="sr-only">Toggle navigation</span>
          </button>
        </div>
        <nav id="stories-mobile-navigation" className={`mobile-nav ${mobileOpen ? "stories-mobile-nav--open" : ""}`} aria-label="Mobile navigation">
          <a href="/experiences" onClick={() => setMobileOpen(false)}>Experiences</a>
          <a href="/about" onClick={() => setMobileOpen(false)}>About us</a>
          <a href="/stories" onClick={() => setMobileOpen(false)}>Our stories</a>
          <a href="/how-we-celebrate" onClick={() => setMobileOpen(false)}>How we celebrate</a>
          <a href="/contact" onClick={() => setMobileOpen(false)}>Contact us <ArrowRight size={16} /></a>
          <a href="#inquiry" onClick={() => setMobileOpen(false)}>Start a conversation <ArrowRight size={16} /></a>
        </nav>
      </header>

      <main>
        <section className="stories-hero section-paper">
          <div className="stories-hero__image" aria-hidden="true" />
          <div className="editorial-container stories-hero__inner" data-story-reveal>
            <p className="eyebrow"><span className="eyebrow__dot" /> Team Up / Our stories</p>
            <h1>Our<br /><em>Stories.</em></h1>
            <p>Every one of these started as a single afternoon. Here’s what they became.</p>
            <BuntingDivider />
          </div>
          <div className="story-index" aria-label="Story index">
            <div className="editorial-container story-index__inner">
              <span className="story-index__label">Jump to a story</span>
              {stories.map((story) => <a key={story.id} href={`#${story.id}`}>{story.title} <ArrowDownRight size={14} /></a>)}
            </div>
          </div>
        </section>

        <div className="story-media-note"><Camera size={15} strokeWidth={1.5} /><span>Prototype media shown here is replaceable scaffolding — approved event photography and video should take its place before launch.</span></div>

        {stories.map((story) => <StorySequence key={story.id} story={story} />)}

        <section className="stories-cta section-ink" id="inquiry">
          <div className="editorial-container">
            <BuntingDivider light />
            <div className="stories-cta__layout">
              <div className="stories-cta__copy" data-story-reveal>
                <p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> The next chapter</p>
                <h2>Ready to write<br /><em>the next one?</em></h2>
                <p>Bring us the cause, the team, or even the roughest first thought. We’ll help shape what comes next.</p>
              </div>
              <form className="stories-inquiry" onSubmit={handleSubmit} data-story-reveal>
                <label><span>Your name</span><input name="name" placeholder="How should we call you?" required /></label>
                <label><span>Organization</span><input name="organization" placeholder="Where are you working from?" required /></label>
                <label><span>Email or phone</span><input name="contact" placeholder="How should we reach you?" required /></label>
                <button type="submit" className="button button--coral">Send us an inquiry <ArrowRight size={17} /></button>
                <a className="whatsapp-button" href="#inquiry" onClick={handleWhatsApp}><MessageCircle size={18} strokeWidth={1.5} /> Chat with us on WhatsApp</a>
                <p className="stories-inquiry__fineprint">Short form, low pressure. This prototype does not send submissions yet.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer section-paper stories-footer">
        <div className="editorial-container">
          <div className="site-footer__top"><div><a className="brand-link brand-link--footer" href="/" aria-label="Back to homepage"><TeamUpLogo /></a><p className="site-footer__mission">We turn CSR employee activities into moments people remember.</p></div><div className="site-footer__contact"><p className="eyebrow"><span className="eyebrow__dot" /> Keep in touch</p><a href="mailto:hello@teamup.org">hello@teamup.org</a><div className="site-footer__socials"><a href="#inquiry">Instagram</a><a href="#inquiry">LinkedIn</a></div></div></div>
          <div className="site-footer__bottom"><span>Team Up is a registered NGO, with provisional 12A and 80G certification.</span><span>Celebration, not charity.</span></div>
        </div>
      </footer>
    </div>
  );
}

function StorySequence({ story }: { story: Story }) {
  return (
    <article className={`story-sequence story-sequence--${story.accent}`} id={story.id}>
      <section className="story-panel story-panel--banner" data-story-reveal>
        <img src={story.image} alt={story.alt} />
        <div className="story-panel__scrim" />
        <div className="story-panel__banner-copy">
          <p className="story-panel__kicker">{story.number} / The story</p>
          <h2>{story.title}</h2>
          <p>{story.scene}</p>
        </div>
        <span className="story-panel__scroll">Scroll to enter <ArrowDownRight size={16} /></span>
      </section>

      <section className={`story-panel story-panel--narrative story-panel--narrative-${story.galleryStyle} section-paper`} data-story-reveal>
        <div className="editorial-container story-narrative__inner">
          <p className="eyebrow"><span className="eyebrow__dot" /> The story</p>
          <div className="story-narrative__copy"><h3>{story.galleryStyle === "timeline" ? <>A day that<br /><em>felt like family.</em></> : story.galleryStyle === "closeups" ? <>A room that<br /><em>forgot itself.</em></> : story.galleryStyle === "festival" ? <>A festival<br /><em>that welcomed everyone.</em></> : <>What happened<br /><em>beneath the day.</em></>}</h3><p>{story.story}</p></div>
          <div className="story-narrative__signature"><span className="story-narrative__line" /><span>{story.proof}</span></div>
          {story.galleryStyle === "timeline" ? <div className="story-timeline"><span>Tree</span><span>Santa</span><span>300 children</span><span>One full afternoon</span></div> : null}
        </div>
      </section>

      <section className="story-panel story-panel--gallery section-sand" data-story-reveal>
        <div className="editorial-container">
          <div className="story-gallery__heading"><p className="eyebrow"><span className="eyebrow__dot" /> The gallery</p><p>{story.galleryStyle === "evidence" ? "The stage, the crowd, and the moment the beat left the room." : story.galleryStyle === "closeups" ? "Brushes, hands, paper, and the small concentration of making something new." : story.galleryStyle === "festival" ? "Mascots, music, and a hall full of colour." : "The tree, the guests, and the details that made an ordinary afternoon feel complete."}</p></div>
          <div className={`story-gallery-grid story-gallery-grid--${story.galleryStyle}`}>
            {story.galleryCaptions.map((caption, index) => <figure key={caption} className={`story-gallery-frame story-gallery-frame--${index + 1}`}><img src={story.galleryImages?.[index] ?? story.image} alt={`${story.alt} — ${caption}`} /><figcaption><span>{String(index + 1).padStart(2, "0")}</span>{caption}</figcaption></figure>)}
          </div>
          {!story.galleryImages ? <p className="story-gallery__note"><Camera size={15} strokeWidth={1.5} /> Gallery frames await the approved event image set.</p> : null}
        </div>
      </section>

      {story.videoSrc ? <section className="story-panel story-panel--video section-paper" data-story-reveal><div className="editorial-container"><div className="story-video"><video controls src={story.videoSrc} /><div className="story-video__label"><CirclePlay size={16} /> The Dharavi reel</div></div></div></section> : null}

      <section className="story-panel story-panel--moment section-teal" data-story-reveal>
        <div className="editorial-container story-moment__inner"><p className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> The moment</p><blockquote>“{story.moment}”</blockquote><BuntingDivider light /><span className="story-moment__proof">{story.proof}</span></div>
      </section>

      <div className="story-chapter-break" aria-hidden="true"><BuntingDivider /></div>
    </article>
  );
}
