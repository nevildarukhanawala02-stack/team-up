/**
 * Team Up experience catalogue — the "Team Up format" content framework.
 *
 * This is the site's single source of truth for every experience — concept
 * or delivered. To add a new REAL experience, fill in every field of
 * `ExperienceDetail` below (that's the framework — see the field comments).
 * A concept idea just needs the top-level fields and an `icon`, no `detail`.
 *
 * The `detail` shape mirrors the Master Framework's Celebration Formula
 * (§5A): every real experience must show Story Direction and Ceremony —
 * the two things Team Up always provides, regardless of budget. Flavor and
 * Star Power are optional and situational, so they're not structured
 * fields — only mention them inside `storyDirection`/`ceremony` prose if
 * genuinely present, never as a headline.
 */

import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  BookHeart,
  ChefHat,
  HandHeart,
  Music2,
  Shield,
  Store,
  TreePine,
  WandSparkles,
  Waves,
} from "lucide-react";

export type ExperienceCategory = "education" | "environment" | "health-inclusion" | "womens-empowerment" | "community";

export const categories: { id: ExperienceCategory; label: string }[] = [
  { id: "education", label: "Education" },
  { id: "environment", label: "Environment" },
  { id: "health-inclusion", label: "Health & Inclusion" },
  { id: "womens-empowerment", label: "Women's Empowerment" },
  { id: "community", label: "Community" },
];

/** Master Framework §5, Layer 2 — the four Engagement Formats. Primary filter. */
export type EngagementFormat = "volunteering" | "showcase" | "festive-immersion" | "flagship-journey";

export const formats: { id: EngagementFormat; label: string; description: string }[] = [
  { id: "volunteering", label: "Hands-On Volunteering", description: "Employees actively participate alongside the community." },
  { id: "showcase", label: "Showcase & Spectacle", description: "The community performs; employees and the public are the audience." },
  { id: "festive-immersion", label: "Festive Immersion", description: "Employees join an existing celebration, adding the fun and gifting layer." },
  { id: "flagship-journey", label: "Flagship Journey", description: "The biggest format — multi-location, multi-brand, high production." },
];

export interface ExperienceDetail {
  heroImage: string;
  heroAlt: string;
  partner: string;
  /** Framework §5A #1 — what story this day was decided to tell, before it happened. The real value-add. */
  storyDirection: string;
  /** Framework §5A #2 — the specific ritual or spotlight moment that made the day feel significant. */
  ceremony: string;
  highlights: string[];
  gallery: { src: string; alt: string; caption: string }[];
  proof: string;
  /** Optional — real, citable press coverage only. Understated "as seen in" credit, never a headline claim. */
  pressLinks?: { title: string; source: string; url: string }[];
  /** Anchor id of the matching entry in OurStories.tsx, for a "read the full story" cross-link. */
  storyLink: string;
  /** Set true only while a real event is still waiting on approved photography — keeps the placeholder honest. */
  imagePlaceholder?: boolean;
}

export interface Experience {
  slug: string;
  name: string;
  hook: string;
  category: ExperienceCategory;
  format: EngagementFormat;
  color: "gold" | "coral" | "teal";
  icon?: LucideIcon;
  detail?: ExperienceDetail;
}

export const experiences: Experience[] = [
  {
    slug: "dharavi-dreams",
    name: "Dharavi Dreams",
    hook: "India's first musical hip-hop theatre production — thirteen teenage artists from Dharavi, one real stage.",
    category: "education",
    format: "showcase",
    color: "coral",
    detail: {
      heroImage: "/images/dharavi-dreams-hero.jpg",
      heroAlt: "Young performers mid-jump under red stage lighting during Dharavi Dreams, a hip-hop theatre production",
      partner: "Rahi Theatre Collaboration & The Dharavi Dream Project",
      storyDirection:
        "Before this day happened, we decided what story it was going to tell: that talent doesn't need permission to be seen, it just needs a real stage. We partnered with Rahi Theatre Collaboration and The Dharavi Dream Project — an after-school hip-hop program for underprivileged children in Dharavi, Asia's biggest slum — on Dharavi Dreams, India's first musical hip-hop theatre production, written and directed by Neha Singh. The brief to the crew wasn't 'go capture the event' — it was built around a real audience who came for the show, not the cause.",
      ceremony:
        "Thirteen teenage hip-hop artists took the stage in specially made Sooper Dooper Kids t-shirts — a small, deliberate spotlight moment that made the night feel like an actual premiere, not a community activity with cameras present.",
      highlights: [
        "India's first musical hip-hop theatre production",
        "13 teenage hip-hop artists from Dharavi performed live",
        "Written and directed by Neha Singh",
        "Delivered with Rahi Theatre Collaboration and The Dharavi Dream Project",
      ],
      gallery: [
        { src: "/images/dharavi-dreams-warmup.jpg", alt: "Cast members before the show", caption: "Warming up" },
        { src: "/images/dharavi-dreams-light.jpg", alt: "A breakdancer under stage lighting", caption: "Into the light" },
        { src: "/images/dharavi-dreams-cast.jpg", alt: "The full cast taking a bow on stage", caption: "A real audience" },
        { src: "/images/dharavi-dreams-energy.jpg", alt: "The group celebrating mid-performance", caption: "The beat carries" },
      ],
      proof: "500K+ organic views, zero paid promotion",
      pressLinks: [
        { title: "Clothing brand Sooper Dooper Kids teams with Dharavi Dream Project", source: "Apparel Resources", url: "https://apparelresources.com/business-news/sustainability/clothing-brand-sooper-dooper-kids-teams-dharavi-dream-project/" },
      ],
      storyLink: "beat-that-traveled",
    },
  },
  {
    slug: "colors-on-the-ward",
    name: "Colors on the Ward",
    hook: "A hospital ward turned into an art studio for an afternoon — every child left a winner.",
    category: "health-inclusion",
    format: "volunteering",
    color: "teal",
    detail: {
      heroImage: "/images/team-up-proof-art.jpg",
      heroAlt: "Children creating paintings together in a bright common room",
      partner: "Access Life Assistance Foundation",
      storyDirection:
        "We decided, before the day began, that this wasn't going to be a competition with a winner — it was going to be about a room forgetting, just for a while, where it was. In partnership with Access Life Assistance Foundation, an Indian non-profit supporting over 2,050 underprivileged children with cancer and their families, we turned a hospital ward into an art studio for an afternoon.",
      ceremony:
        "Every child who picked up a brush left with a Sooper Dooper Kids t-shirt and, more than that, an afternoon that looked nothing like the rest of their week — the small ritual of every single participant leaving as a winner, not just one.",
      highlights: [
        "Delivered with Access Life Assistance Foundation",
        "Every single participant went home a winner",
        "Art, music, and dance across the full afternoon",
        "Part of Sooper Dooper Kids' One Purchased = One Donated pledge",
      ],
      gallery: [
        { src: "/images/team-up-proof-art.jpg", alt: "Children creating paintings together in a bright common room", caption: "Artists first" },
      ],
      proof: "Every one went home a winner",
      pressLinks: [
        { title: "Sooper Dooper Kids and Access Life Assistance Foundation unite to support children battling cancer", source: "Apparel Resources", url: "https://apparelresources.com/business-news/sustainability/sooper-dooper-kids-access-life-assistance-foundation-unite-support-children-battling-cancer/" },
      ],
      storyLink: "colors-on-the-ward",
      imagePlaceholder: true,
    },
  },
  {
    slug: "christmas-for-three-hundred",
    name: "Christmas for Three Hundred",
    hook: "Three hundred children, a decorated tree, and an afternoon that felt like family — because it was one.",
    category: "community",
    format: "festive-immersion",
    color: "gold",
    detail: {
      heroImage: "/images/team-up-proof-christmas.jpg",
      heroAlt: "Children gathering around a modest Christmas celebration",
      partner: "A Juhu community partner NGO",
      storyDirection:
        "The celebration wasn't something we added on top of the day — it was the whole point of it. We decided this would be a full festive production, not a scaled-down gesture: Santa, a decorated tree, and the kind of Christmas afternoon every child deserves to have at least once.",
      ceremony:
        "Three hundred children who don't always get a Christmas like this one, got exactly that — Santa's arrival, the tree lighting, and Sooper Dooper Kids branded merch for everyone in the room, simple and full-hearted, nothing held back.",
      highlights: [
        "300 children at a Juhu community celebration",
        "Full festive production — Santa, decorated tree, gifting",
        "Sooper Dooper Kids branded merch for every child",
      ],
      gallery: [
        { src: "/images/team-up-proof-christmas.jpg", alt: "Children gathering around a modest Christmas celebration", caption: "Nothing held back" },
      ],
      proof: "A full-hearted day for 300",
      storyLink: "christmas-for-three-hundred",
      imagePlaceholder: true,
    },
  },
  { slug: "sunset-sessions", name: "Sunset Sessions", hook: "An afternoon with an elder care home, built around music and memory.", category: "community", format: "volunteering", color: "gold", icon: Music2 },
  { slug: "the-little-chefs", name: "The Little Chefs", hook: "Employees and children from a community kitchen cook together, ending in a shared meal everyone made.", category: "education", format: "volunteering", color: "coral", icon: ChefHat },
  { slug: "wonder-day", name: "Wonder Day", hook: "A visiting magician, a room full of kids, and the simple idea that a little wonder goes a long way.", category: "education", format: "festive-immersion", color: "teal", icon: WandSparkles },
  { slug: "green-relay", name: "Green Relay", hook: "Tree planting, reimagined as a playful team relay instead of a quiet, solitary task.", category: "environment", format: "volunteering", color: "gold", icon: TreePine },
  { slug: "storytellers-circle", name: "Storytellers' Circle", hook: "Employees read and tell stories to children in an education program, with the day turned into a keepsake recording.", category: "education", format: "volunteering", color: "coral", icon: BookHeart },
  { slug: "her-turn-to-shine", name: "Her Turn to Shine", hook: "A showcase and market day for local women artisans and entrepreneurs, employees as first customers and cheerleaders.", category: "womens-empowerment", format: "showcase", color: "teal", icon: Store },
  { slug: "sports-day-no-sidelines", name: "Sports Day, No Sidelines", hook: "A joint sports day with a differently-abled community group — everyone plays, nobody just watches.", category: "health-inclusion", format: "volunteering", color: "gold", icon: Accessibility },
  { slug: "threads-of-home", name: "Threads of Home", hook: "A textile or craft workshop with a rural artisan collective, styled into a small showcase at the end of the day.", category: "womens-empowerment", format: "showcase", color: "coral", icon: HandHeart },
  { slug: "guardians-of-the-coast", name: "Guardians of the Coast", hook: "A beach or riverside cleanup with a local youth group, framed as a shared adventure, not a chore.", category: "environment", format: "volunteering", color: "teal", icon: Waves },
  { slug: "heroes-in-uniform", name: "Heroes in Uniform", hook: "A felicitation and storytelling afternoon honoring armed forces veterans and their families.", category: "community", format: "festive-immersion", color: "gold", icon: Shield },
];
