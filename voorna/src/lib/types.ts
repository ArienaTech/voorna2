/**
 * Voorna domain types.
 *
 * Kept framework-free on purpose: when the Expo mobile app is added,
 * this file (and the rest of src/lib) lifts out into a shared package
 * without modification.
 */

export type TemplateId = "pageant" | "community" | "awards" | "custom";

export type EventStatus = "draft" | "active" | "closed";

export type VotingMode = "free" | "paid" | "hybrid";

export type FreeVoteLimit = "per_day" | "per_email" | "per_account";

export type ParticipantStatus = "active" | "hidden" | "disqualified";

export type OrganiserPlan = "free" | "pro";

export interface Organiser {
  id: string;
  user_id: string;
  display_name: string;
  plan: OrganiserPlan;
  stripe_connect_id: string | null;
  stripe_onboarding_complete: boolean;
  created_at: string;
}

export interface VotePackage {
  votes: number;
  /** Price in the smallest currency unit (cents). */
  amount: number;
}

export interface VoornaEvent {
  id: string;
  organiser_id: string;
  slug: string;
  name: string;
  description: string;
  template: TemplateId;
  category_tag: string;
  status: EventStatus;
  voting_mode: VotingMode;
  free_vote_limit: FreeVoteLimit;
  vote_packages: VotePackage[];
  currency: string;
  logo_url: string | null;
  banner_url: string | null;
  location: string | null;
  starts_at: string | null;
  ends_at: string | null;
  contact_email: string | null;
  show_vote_counts: boolean;
  show_leaderboard: boolean;
  created_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  number: number | null;
  photo_url: string | null;
  bio: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  status: ParticipantStatus;
  referral_code: string;
  sort_order: number;
  vote_count: number;
}

export interface Sponsor {
  id: string;
  event_id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  description: string | null;
}

export const DEFAULT_VOTE_PACKAGES: VotePackage[] = [
  { votes: 1, amount: 100 },
  { votes: 10, amount: 800 },
  { votes: 25, amount: 1800 },
  { votes: 50, amount: 3000 },
  { votes: 100, amount: 5000 },
];

export const EVENT_CATEGORIES = [
  "Pageant",
  "Modelling",
  "Talent Show",
  "Awards",
  "Community",
  "Festival",
  "Pet Competition",
  "Charity",
  "School / University",
  "Influencer",
  "Custom",
] as const;
