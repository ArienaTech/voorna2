# Voorna

**Create voting experiences in minutes.**

Voorna lets organisers create professional voting websites for pageants, competitions, awards, talent shows, festivals and community events — no coding required. Free voting events are free forever; paid voting carries an 8% platform fee on vote sales.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Server-rendered public event pages with proper Open Graph tags (referral links shared on social media must unfurl well — this is the growth engine), plus API routes for Stripe webhooks in the same codebase. |
| Database / Auth / Storage | **Supabase** | Postgres with row-level security, built-in auth and file storage. Works identically for the future mobile app. |
| Payments | **Stripe + Stripe Connect (Express)** | Vote package checkout, organiser payouts, Radar fraud protection. |
| Styling | **Tailwind CSS** | Token-driven design system; per-event theming via CSS custom properties. |
| Hosting | **Vercel** | Zero-config Next.js deployment. |

> **Why not Vite?** The original spec proposed a Vite SPA. A SPA can't server-render event pages (bad link previews on WhatsApp/Instagram, weak SEO) and would still need a separate backend for Stripe webhooks. Next.js solves both in one deployable unit.

### Mobile app strategy

Everything in `src/lib/` (types, templates, fee logic, Supabase access) is framework-free by design. When the native app is built:

1. Create an **Expo (React Native)** app.
2. Extract `src/lib/` into a shared workspace package.
3. The mobile app talks to the **same** Supabase project and Stripe account — no backend changes.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys (see below)
npm run dev                   # http://localhost:3000
```

The app runs in **demo mode** without any keys — the landing page, dashboard, create-event wizard and the demo event at `/e/aurora-pageant-2026` all work with sample data.

### Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or `supabase db push`).
3. Copy the project URL and anon key into `.env.local`.

The migration creates all entities (organisers, events, participants, applications, votes, transactions, sponsors, payouts, page views, settings), row-level security policies, and the `cast_free_vote` function which enforces the anti-bot rules from the spec (10s per-IP cooldown, 50 free votes per IP per day, one vote per day per participant).

### Connect Stripe (next PR)

Checkout session creation, the payment webhook (allocate votes → update leaderboard → record transaction), and Connect Express onboarding are the next milestone — the schema, fee math (`src/lib/fees.ts`) and UI hooks are already in place.

## Project structure

```
src/
  app/
    page.tsx                  # Landing page
    (auth)/                   # Login / signup / forgot password
    dashboard/                # Organiser dashboard + create-event wizard
    e/[slug]/                 # Public event page (server-rendered, themed)
    embed/[slug]/             # Iframe-able voting widget
    api/events/[slug]/votes/  # Free-vote endpoint
  components/
  lib/                        # Framework-free domain logic (shared with future mobile app)
supabase/migrations/          # Database schema
```

## Templates

One template choice drives both the **visual theme** and the **language** of an event site:

| Template | Style | Terminology |
|---|---|---|
| Pageant / Glam | Black, white, gold; editorial serif | Contestants · Crown · Finalists |
| Community / Festival | Bright, rounded, playful | Entries · Vote for your favourite |
| Awards / Corporate | Minimal, neutral grid | Nominees · Vote Now |
| Custom | Neutral defaults | Participants · Votes |

Themes are emitted as CSS custom properties (`src/lib/templates.ts`) so every event-page component inherits them automatically.

## Roadmap

- [x] Landing page, auth, dashboard shell, create-event wizard
- [x] Public event pages with template theming + free voting
- [x] Embed widget
- [x] Database schema with RLS + rate-limited voting
- [ ] Stripe Checkout + webhook (paid votes)
- [ ] Stripe Connect Express onboarding + payouts
- [ ] Participant management UI (add/edit/reorder, photos via Supabase Storage)
- [ ] Applications flow
- [ ] Analytics charts
- [ ] Email notifications
- [ ] Admin panel
