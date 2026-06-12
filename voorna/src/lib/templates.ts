import type { TemplateId } from "./types";

/**
 * The template an organiser picks at creation drives both the visual
 * theme of their public event page and the language used throughout it
 * (spec: "Event Templates"). Theme values are emitted as CSS custom
 * properties on the event page root so every section inherits them.
 */

export interface TemplateTheme {
  /** Page background */
  bg: string;
  /** Card / surface background */
  surface: string;
  /** Primary text */
  text: string;
  /** Secondary text */
  textSoft: string;
  /** Accent (buttons, highlights) */
  accent: string;
  /** Text on accent */
  accentFg: string;
  /** Border */
  border: string;
  /** Border radius for cards/buttons */
  radius: string;
  /** Display font stack for headings */
  displayFont: string;
}

export interface TemplateTerms {
  participants: string;
  participant: string;
  voteCta: string;
  leaderboardTitle: string;
  winnerWord: string;
}

export interface TemplateDef {
  id: TemplateId;
  name: string;
  tagline: string;
  theme: TemplateTheme;
  terms: TemplateTerms;
}

export const TEMPLATES: Record<TemplateId, TemplateDef> = {
  pageant: {
    id: "pageant",
    name: "Pageant / Glam",
    tagline: "Black, white and gold. Editorial and elegant.",
    theme: {
      bg: "#0E0D0B",
      surface: "#1A1814",
      text: "#F7F4ED",
      textSoft: "#B8B2A4",
      accent: "#D4AF37",
      accentFg: "#0E0D0B",
      border: "rgba(212,175,55,0.22)",
      radius: "2px",
      displayFont: "var(--font-display), Georgia, serif",
    },
    terms: {
      participants: "Contestants",
      participant: "Contestant",
      voteCta: "Cast Your Vote",
      leaderboardTitle: "Road to the Crown",
      winnerWord: "Finalists",
    },
  },
  community: {
    id: "community",
    name: "Community / Festival",
    tagline: "Bright, playful and welcoming.",
    theme: {
      bg: "#FFFBF2",
      surface: "#FFFFFF",
      text: "#27221B",
      textSoft: "#6E6557",
      accent: "#E85D2F",
      accentFg: "#FFFFFF",
      border: "#F0E5D2",
      radius: "16px",
      displayFont: "var(--font-sans), Inter, sans-serif",
    },
    terms: {
      participants: "Entries",
      participant: "Entry",
      voteCta: "Vote for your favourite",
      leaderboardTitle: "Crowd Favourites",
      winnerWord: "Top Entries",
    },
  },
  awards: {
    id: "awards",
    name: "Awards / Corporate",
    tagline: "Minimal, neutral and credible.",
    theme: {
      bg: "#FFFFFF",
      surface: "#FAFAFA",
      text: "#111113",
      textSoft: "#6B6B70",
      accent: "#18181B",
      accentFg: "#FFFFFF",
      border: "#E8E8E6",
      radius: "8px",
      displayFont: "var(--font-sans), Inter, sans-serif",
    },
    terms: {
      participants: "Nominees",
      participant: "Nominee",
      voteCta: "Vote Now",
      leaderboardTitle: "Current Standings",
      winnerWord: "Leaders",
    },
  },
  custom: {
    id: "custom",
    name: "Custom",
    tagline: "A blank canvas with sensible defaults.",
    theme: {
      bg: "#FFFFFF",
      surface: "#FAFAF8",
      text: "#101010",
      textSoft: "#52525B",
      accent: "#B08A2E",
      accentFg: "#FFFFFF",
      border: "#E5E5E0",
      radius: "10px",
      displayFont: "var(--font-sans), Inter, sans-serif",
    },
    terms: {
      participants: "Participants",
      participant: "Participant",
      voteCta: "Vote",
      leaderboardTitle: "Leaderboard",
      winnerWord: "Leaders",
    },
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);

/** Emit a template's theme as CSS custom properties for the event page root. */
export function themeVars(t: TemplateTheme): React.CSSProperties {
  return {
    "--ev-bg": t.bg,
    "--ev-surface": t.surface,
    "--ev-text": t.text,
    "--ev-text-soft": t.textSoft,
    "--ev-accent": t.accent,
    "--ev-accent-fg": t.accentFg,
    "--ev-border": t.border,
    "--ev-radius": t.radius,
    "--ev-display": t.displayFont,
  } as React.CSSProperties;
}
