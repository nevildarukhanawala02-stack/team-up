/**
 * Team Up experience catalogue.
 *
 * This is the site's single source of truth for every experience — concept
 * or delivered. To add a new experience, add one entry to `experiences`
 * below and fill in `detail` if it's real, delivered work with a proof
 * point (that unlocks its own page at /experiences/[slug]). Leave `detail`
 * out for a concept card — those stay lightweight, icon-based teasers on
 * the Experiences page (see file header note in Experiences.tsx on why
 * concepts intentionally look different from delivered work).
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

export interface ExperienceDetail {
  heroImage: string;
  heroAlt: string;
  partner: string;
  overview: string;
  highlights: string[];
  gallery: { src: string; alt: string; caption: string }[];
  proof: string;
  /** Anchor id of the matching entry in OurStories.tsx, for a "read the full story" cross-link. */
  storyLink: string;
}

export interface Experience {
  slug: string;
  name: string;
  hook: string;
  category: ExperienceCategory;
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
    color: "coral",
    detail: {
      heroImage: "/images/dharavi-dreams-hero.jpg",
      heroAlt: "Young performers mid-jump under red stage lighting during Dharavi Dreams, a hip-hop theatre production",
      partner: "Rahi Theatre Collaboration & The Dharavi Dream Project",
      overview:
        "We partnered with Rahi Theatre Collaboration and The Dharavi Dream Project — an after-school hip-hop program for underprivileged children in Dharavi, Asia's biggest slum — on Dharavi Dreams, India's first musical hip-hop theatre production, written and directed by Neha Singh. Thirteen teenage hip-hop artists took the stage in specially made Sooper Dooper Kids t-shirts, in front of a real audience who came for the show, not the cause.",
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
      storyLink: "beat-that-traveled",
    },
  },
  {
    slug: "colors-on-the-ward",
    name: "Colors on the Ward",
    hook: "A hospital ward turned into an art studio for an afternoon — every child left a winner.",
    category: "health-inclusion",
    color: "teal",
    detail: {
      heroImage: "/images/team-up-proof-art.jpg",
      heroAlt: "Children creating paintings together in a bright common room",
      partner: "Access Life Assistance Foundation",
      overview:
        "In partnership with Access Life Assistance Foundation — an Indian non-profit supporting over 2,050 underprivileged children with cancer and their families — we turned a hospital ward into an art studio for an afternoon. Every child who picked up a brush left with a Sooper Dooper Kids t-shirt and, more than that, a day that looked nothing like the rest of their week.",
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
      storyLink: "colors-on-the-ward",
    },
  },
  { slug: "sunset-sessions", name: "Sunset Sessions", hook: "An afternoon with an elder care home, built around music and memory.", category: "community", color: "gold", icon: Music2 },
  { slug: "the-little-chefs", name: "The Little Chefs", hook: "Employees and children from a community kitchen cook together, ending in a shared meal everyone made.", category: "education", color: "coral", icon: ChefHat },
  { slug: "wonder-day", name: "Wonder Day", hook: "A visiting magician, a room full of kids, and the simple idea that a little wonder goes a long way.", category: "education", color: "teal", icon: WandSparkles },
  { slug: "green-relay", name: "Green Relay", hook: "Tree planting, reimagined as a playful team relay instead of a quiet, solitary task.", category: "environment", color: "gold", icon: TreePine },
  { slug: "storytellers-circle", name: "Storytellers' Circle", hook: "Employees read and tell stories to children in an education program, with the day turned into a keepsake recording.", category: "education", color: "coral", icon: BookHeart },
  { slug: "her-turn-to-shine", name: "Her Turn to Shine", hook: "A showcase and market day for local women artisans and entrepreneurs, employees as first customers and cheerleaders.", category: "womens-empowerment", color: "teal", icon: Store },
  { slug: "sports-day-no-sidelines", name: "Sports Day, No Sidelines", hook: "A joint sports day with a differently-abled community group — everyone plays, nobody just watches.", category: "health-inclusion", color: "gold", icon: Accessibility },
  { slug: "threads-of-home", name: "Threads of Home", hook: "A textile or craft workshop with a rural or slum community, styled into a small showcase at the end of the day.", category: "womens-empowerment", color: "coral", icon: HandHeart },
  { slug: "guardians-of-the-coast", name: "Guardians of the Coast", hook: "A beach or riverside cleanup with a local youth group, framed as a shared adventure, not a chore.", category: "environment", color: "teal", icon: Waves },
  { slug: "heroes-in-uniform", name: "Heroes in Uniform", hook: "A felicitation and storytelling afternoon honoring armed forces veterans and their families.", category: "community", color: "gold", icon: Shield },
];
