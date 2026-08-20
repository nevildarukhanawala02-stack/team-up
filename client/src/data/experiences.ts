/**
 * Team Up experience catalogue — the "Team Up format" content framework.
 *
 * The taxonomy (categories, formats, and the field shapes below) lives in
 * code since it's structural, not day-to-day content. The actual experience
 * entries live in the database now and are managed from /admin/experiences —
 * `fetchExperiencesFromApi()` / `rowToExperience()` below fetch and reshape
 * them into the same shape the site's pages already render.
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

/** Icons available for concept cards, keyed by name (matches what the admin form lets you pick). */
export const iconOptions: Record<string, LucideIcon> = {
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
};

export interface ExperienceDetail {
  heroImage: string;
  heroAlt: string;
  partner: string;
  /** Framework §5A #1 — what story this day was decided to tell, before it happened. The real value-add. */
  storyDirection: string;
  /** Framework §5A #2 — the specific ritual or spotlight moment that made the day feel significant. */
  ceremony: string;
  /** Framework §5A #3 — what's still true after the day ends. Only a real, verified outcome; never a fabricated stat. */
  impact: string;
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

/**
 * For concept ideas only — never for real, delivered experiences (those use
 * `ExperienceDetail`). Deliberately has no `proof`, no `gallery`, no
 * `pressLinks` — nothing that could read as a verified fact about something
 * that hasn't happened. Framework §8: concepts stay "undefined enough to
 * invite co-creation," never dressed up as a fixed, delivered package.
 */
export interface ConceptPreview {
  /** 2-4 sentences, conditional/future voice only ("could look like", never "was" or "did"). */
  description: string;
  /** 3-5 illustrative possibilities — framed as options, not commitments or facts. */
  possibleElements: string[];
}

export interface Experience {
  slug: string;
  name: string;
  hook: string;
  category: ExperienceCategory;
  format: EngagementFormat;
  color: "gold" | "coral" | "teal";
  icon?: LucideIcon;
  /** Illustrative mood image for concept cards — never claims to document a real event (no "Delivered" badge shows for these). */
  image?: string;
  imageAlt?: string;
  detail?: ExperienceDetail;
  preview?: ConceptPreview;
}

/** Raw shape returned by /api/experiences — flat, matches the database row. */
export interface ExperienceRow {
  id: number;
  slug: string;
  name: string;
  hook: string;
  category: string;
  format: string;
  color: string;
  isReal: boolean;
  displayOrder: number;
  iconName: string | null;
  image: string | null;
  imageAlt: string | null;
  previewDescription: string | null;
  previewPossibleElements: string[] | null;
  heroImage: string | null;
  heroAlt: string | null;
  partner: string | null;
  storyDirection: string | null;
  ceremony: string | null;
  impact: string | null;
  highlights: string[] | null;
  gallery: { src: string; alt: string; caption: string }[] | null;
  proof: string | null;
  pressLinks: { title: string; source: string; url: string }[] | null;
  storyLink: string | null;
  imagePlaceholder: boolean | null;
}

/** Reshapes an API row into the nested Experience shape the pages already render. */
export function rowToExperience(row: ExperienceRow): Experience {
  const base = {
    slug: row.slug,
    name: row.name,
    hook: row.hook,
    category: row.category as ExperienceCategory,
    format: row.format as EngagementFormat,
    color: row.color as "gold" | "coral" | "teal",
  };

  if (row.isReal) {
    return {
      ...base,
      detail: {
        heroImage: row.heroImage || "",
        heroAlt: row.heroAlt || "",
        partner: row.partner || "",
        storyDirection: row.storyDirection || "",
        ceremony: row.ceremony || "",
        impact: row.impact || "",
        highlights: row.highlights || [],
        gallery: row.gallery || [],
        proof: row.proof || "",
        pressLinks: row.pressLinks && row.pressLinks.length > 0 ? row.pressLinks : undefined,
        storyLink: row.storyLink || row.slug,
        imagePlaceholder: row.imagePlaceholder || undefined,
      },
    };
  }

  return {
    ...base,
    icon: row.iconName ? iconOptions[row.iconName] : undefined,
    image: row.image || undefined,
    imageAlt: row.imageAlt || undefined,
    preview: {
      description: row.previewDescription || "",
      possibleElements: row.previewPossibleElements || [],
    },
  };
}

export async function fetchExperiencesFromApi(): Promise<Experience[]> {
  const res = await fetch("/api/experiences");
  if (!res.ok) throw new Error("Failed to load experiences.");
  const data = await res.json();
  return (data.experiences as ExperienceRow[]).map(rowToExperience);
}

export async function fetchExperienceFromApi(slug: string): Promise<Experience | null> {
  const res = await fetch(`/api/experiences/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load experience.");
  const data = await res.json();
  return rowToExperience(data.experience as ExperienceRow);
}
