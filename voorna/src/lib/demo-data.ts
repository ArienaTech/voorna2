import type { Participant, VoornaEvent } from "./types";
import { DEFAULT_VOTE_PACKAGES } from "./types";

/**
 * Demo event shown at /e/aurora-pageant-2026 before Supabase is connected,
 * and used by the landing page showcase. Mirrors real DB shapes exactly.
 */

export const DEMO_EVENT: VoornaEvent = {
  id: "demo-event",
  organiser_id: "demo-organiser",
  slug: "aurora-pageant-2026",
  name: "Miss Aurora 2026",
  description:
    "Twelve finalists. One crown. Public voting decides who takes the title at the Aurora Grand Final on 30 August. Every vote counts toward the People's Choice award.",
  template: "pageant",
  category_tag: "Pageant",
  status: "active",
  voting_mode: "hybrid",
  free_vote_limit: "per_day",
  vote_packages: DEFAULT_VOTE_PACKAGES,
  currency: "USD",
  logo_url: null,
  banner_url: null,
  location: "Auckland, New Zealand",
  starts_at: "2026-06-01T00:00:00Z",
  ends_at: "2026-08-30T12:00:00Z",
  contact_email: "hello@aurorapageant.com",
  show_vote_counts: true,
  show_leaderboard: true,
  created_at: "2026-05-01T00:00:00Z",
};

const names = [
  ["Amara Chen", 1842],
  ["Sofia Reyes", 1690],
  ["Tiana Walker", 1577],
  ["Mereana Kahu", 1431],
  ["Isla Thompson", 1268],
  ["Priya Sharma", 1104],
  ["Grace Okafor", 987],
  ["Lily Nguyen", 845],
] as const;

export const DEMO_PARTICIPANTS: Participant[] = names.map(([name, votes], i) => ({
  id: `demo-p-${i + 1}`,
  event_id: "demo-event",
  name,
  number: i + 1,
  photo_url: null,
  bio: "Finalist, Miss Aurora 2026.",
  instagram: null,
  facebook: null,
  tiktok: null,
  status: "active",
  referral_code: `aurora-${i + 1}`,
  sort_order: i,
  vote_count: votes,
}));
