import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { Reveal } from "@/components/landing/reveal";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { Button } from "@/components/ui/button";

/* ----------------------------- content ----------------------------- */

const HERO_META = [
  { stat: "0%", label: "on free voting" },
  { stat: "8%", label: "platform fee on paid votes" },
  { stat: "4", label: "visual starter templates" },
  { stat: "<10 min", label: "to go live" },
];

const TICKETS = [
  {
    tag: "Contestant · 01",
    num: "#0007",
    name: "Miss Aurora 2027",
    role: "Pageant / Glam template",
    pct: 82,
    votes: "14,930",
    className: "top-0 right-0 z-30 -rotate-2",
  },
  {
    tag: "Finalist · 02",
    num: "#0042",
    name: "Riverside Festival",
    role: "Community / Festival template",
    pct: 64,
    votes: "8,402",
    className: "top-[120px] right-10 z-20 rotate-3 opacity-90",
  },
  {
    tag: "Nominee · 03",
    num: "#0118",
    name: "Lagos Lights Award",
    role: "Awards / Corporate template",
    pct: 38,
    votes: "2,118",
    className: "top-[230px] right-2 z-10 -rotate-[5deg] opacity-55",
  },
];

const STEPS = [
  {
    index: "01",
    title: "Pick a template",
    body: "Choose Pageant / Glam, Community / Festival, Awards / Corporate, or start from a blank Custom canvas. The template sets your colours, fonts, and the language used across your whole site.",
  },
  {
    index: "02",
    title: "Add your event & entrants",
    body: "Drop in your event details, upload photos and bios for each entrant, and decide how voting works — free, paid, or a mix of both.",
  },
  {
    index: "03",
    title: "Share & collect votes",
    body: "Publish your page, hand each entrant their own referral link, and watch the leaderboard update in real time as votes come in.",
  },
];

const TEMPLATE_CARDS = [
  {
    chip: "Contestants · Crown",
    title: "Pageant / Glam",
    titleClass: "font-display text-2xl font-semibold text-white",
    chipClass: "border-[rgba(244,231,197,0.35)] text-[#F4E7C5]",
    bg: "linear-gradient(160deg,#1a1a1a 0%, #2b2620 70%, #C9A24B 140%)",
    name: "Pageant / Glam",
    body: "Black, white & gold. Editorial serif headings for crowning moments.",
  },
  {
    chip: "Entries · Favourites",
    title: "Community / Festival",
    titleClass: "font-sans text-2xl font-extrabold text-[#3a1700]",
    chipClass: "border-[rgba(92,42,0,0.25)] text-[#5c2a00]",
    bg: "linear-gradient(160deg,#FFE7A8 0%, #FF9F6B 60%, #FF6F91 130%)",
    name: "Community / Festival",
    body: "Bright, playful and rounded — built for \u201cvote for your favourite\u201d energy.",
  },
  {
    chip: "Nominees · Categories",
    title: "Awards / Corporate",
    titleClass: "font-sans text-[22px] font-bold text-[#1f1c14]",
    chipClass: "border-[rgba(60,56,46,0.25)] text-[#3c382e]",
    bg: "linear-gradient(160deg,#F4F1EA 0%, #E7E2D5 100%)",
    name: "Awards / Corporate",
    body: "Minimal, neutral and grid-led — for ceremonies and category-based voting.",
  },
  {
    chip: "Blank canvas",
    title: "// custom",
    titleClass: "font-mono text-lg text-ink",
    chipClass: "border-line text-ink-soft",
    bg: "repeating-linear-gradient(45deg, #fff 0 14px, #F2EFE7 14px 28px)",
    name: "Custom",
    body: "Neutral defaults and generic terminology — your starting point, your rules.",
  },
];

const FEATURES = [
  {
    icon: "W",
    title: "Full event website",
    body: "A mobile-responsive microsite with hero, about, leaderboard, sponsors and FAQ sections — toggle each on or off.",
  },
  {
    icon: "$",
    title: "Free & paid voting",
    body: "Run free voting with per-day, per-email or per-account limits, or sell vote packages with a transparent 8% platform fee.",
  },
  {
    icon: "↗",
    title: "Referral links",
    body: "Every participant gets a unique shareable link, so the dashboard shows exactly how many votes their network drove.",
  },
  {
    icon: "◧",
    title: "Embed widget",
    body: "Already have a website? Drop in a lightweight voting widget or a \u201cVote Now\u201d badge that links to your Voorna page.",
  },
  {
    icon: "⛁",
    title: "Stripe Connect payouts",
    body: "Onboard with Stripe Connect to accept card, Apple Pay and Google Pay, and withdraw earnings on Stripe's standard schedule.",
  },
  {
    icon: "▣",
    title: "Real-time leaderboard",
    body: "Live rankings with rank, name, photo and vote count — or hide counts entirely, organiser's choice.",
  },
];

const SHOWCASE = [
  { label: "Pageant", name: "Miss Coastal 2027", stats: [["Entrants", "24"], ["Voting", "Paid"]] },
  { label: "School Competition", name: "Northgate Talent Night", stats: [["Entrants", "41"], ["Voting", "Free"]] },
  { label: "Charity Campaign", name: "Paws & Vote", stats: [["Entrants", "67"], ["Voting", "Hybrid"]] },
  { label: "Awards", name: "Indie Maker Awards", stats: [["Categories", "9"], ["Voting", "Free"]] },
  { label: "Festival", name: "Riverside Music Poll", stats: [["Entrants", "18"], ["Voting", "Paid"]] },
];

const FAQS = [
  {
    q: "Is it really free to start?",
    a: "Yes. Free events get unlimited participants and votes, a full event website, and the embed widget — with a \u201cPowered by Voorna\u201d badge on the public page. No card is required to begin.",
  },
  {
    q: "How does the 8% fee work?",
    a: "Voorna takes 8% of the gross value of paid vote purchases. Stripe's standard processing fee is shown separately in your dashboard — nothing is bundled or hidden.",
  },
  {
    q: "Can voters split a purchase across multiple entrants?",
    a: "Not currently — each checkout allocates votes to one participant. This keeps the purchase flow quick and simple for voters.",
  },
  {
    q: "Are vote purchases tax-deductible for charity events?",
    a: "No. Vote purchases are receipted as digital goods, not donations, even on charity campaigns. Voorna does not issue donation receipts.",
  },
  {
    q: "How do participant referral links work?",
    a: "Every participant gets a unique link to your event page. Your dashboard shows how many votes came through each link, so entrants can mobilise their own networks.",
  },
  {
    q: "When can I withdraw my earnings?",
    a: "Once your Stripe Connect account is verified, payouts follow Stripe's standard payout schedule. Your dashboard always shows available, pending, and total earnings.",
  },
];

/* ---------------------------- helpers ----------------------------- */

function SectionHead({
  label,
  title,
  sub,
  className = "",
}: {
  label: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <Reveal className={`mb-14 max-w-[640px] ${className}`}>
      <span className="mb-3.5 block font-mono text-xs uppercase tracking-[0.14em] text-gold-deep">
        {label}
      </span>
      <h2 className="font-display text-[clamp(30px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.01em]">
        {title}
      </h2>
      {sub && (
        <p className="mt-3.5 text-[17px] leading-relaxed text-ink-soft">{sub}</p>
      )}
    </Reveal>
  );
}

/* ------------------------------ page ------------------------------ */

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line pb-[100px] pt-[120px]">
          <div className="mx-auto grid max-w-wrap items-center gap-16 px-7 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-3.5 py-[7px] font-mono text-xs uppercase tracking-[0.12em] text-gold-deep">
                <span className="h-[7px] w-[7px] rounded-full bg-gold animate-pulse-dot" />
                Live vote counting, every package
              </div>
              <h1 className="mb-[22px] font-display text-[clamp(40px,6vw,68px)] font-semibold leading-[1.04] tracking-[-0.01em]">
                Create voting
                <br />
                experiences <em className="italic text-gold-deep">in minutes.</em>
              </h1>
              <p className="mb-9 max-w-[480px] text-lg leading-[1.65] text-ink-soft">
                Launch a branded voting website for your pageant, awards night,
                talent show, or community campaign — no code, no setup fees, and
                nothing to install.
              </p>
              <div className="mb-10 flex flex-wrap gap-3.5">
                <Link href="/signup">
                  <Button variant="gold" size="lg">
                    Create Free Event
                  </Button>
                </Link>
                <Link href="/e/aurora-pageant-2026">
                  <Button variant="secondary" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-7">
                {HERO_META.map((m) => (
                  <div key={m.label} className="text-[13px] text-ink-soft">
                    <strong className="block font-display text-[22px] font-semibold text-ink">
                      {m.stat}
                    </strong>
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Vote ticket stack */}
            <div className="relative h-[480px]" aria-hidden>
              {TICKETS.map((t) => (
                <div
                  key={t.name}
                  className={`absolute w-full max-w-[380px] rounded-[18px] border border-line bg-white px-[26px] py-6 shadow-ticket ${t.className}`}
                >
                  <span className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper" />
                  <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border border-line bg-paper" />
                  <div className="mb-4 flex items-start justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-deep">
                      {t.tag}
                    </span>
                    <span className="font-mono text-[11px] text-ink-soft">{t.num}</span>
                  </div>
                  <p className="mb-1 font-display text-2xl font-semibold">{t.name}</p>
                  <p className="mb-[18px] text-[13px] text-ink-soft">{t.role}</p>
                  <div className="mb-2.5 h-2 overflow-hidden rounded-full bg-paper-shade">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold"
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span>Votes</span>
                    <span className="font-display text-lg font-semibold">{t.votes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24" id="how">
          <div className="mx-auto max-w-wrap px-7">
            <SectionHead
              label="How it works"
              title="From sign-up to your first vote, on the same afternoon."
              sub="Every event follows the same straight line — choose a look, describe the event, open the doors."
            />
            <div className="grid gap-7 md:grid-cols-3">
              {STEPS.map((s) => (
                <Reveal key={s.index}>
                  <div className="h-full rounded-[18px] border border-line bg-white px-7 py-8">
                    <div
                      className="mb-[18px] font-display text-[46px] leading-none"
                      style={{
                        WebkitTextStroke: "1.5px #C9A24B",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {s.index}
                    </div>
                    <h3 className="mb-2.5 font-display text-[19px] font-semibold">
                      {s.title}
                    </h3>
                    <p className="text-[14.5px] leading-relaxed text-ink-soft">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="border-t border-line bg-paper-shade py-24" id="templates">
          <div className="mx-auto max-w-wrap px-7">
            <SectionHead
              label="Starter templates"
              title="One choice sets your whole site's voice."
              sub={`Pick a visual template and it shapes more than colour — it changes the words your voters see, from \u201cContestants\u201d to \u201cNominees\u201d to \u201cEntries.\u201d`}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {TEMPLATE_CARDS.map((t) => (
                <Reveal key={t.name}>
                  <div className="flex min-h-[300px] h-full flex-col overflow-hidden rounded-[18px] border border-line transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                    <div
                      className="flex flex-1 flex-col justify-end p-[22px]"
                      style={{ background: t.bg }}
                    >
                      <span
                        className={`mb-3.5 inline-block self-start rounded-full border px-2.5 py-[5px] font-mono text-[10.5px] uppercase tracking-[0.1em] ${t.chipClass}`}
                      >
                        {t.chip}
                      </span>
                      <div className={t.titleClass}>{t.title}</div>
                    </div>
                    <div className="bg-white px-[22px] py-[18px]">
                      <h3 className="mb-1.5 font-display text-[17px] font-semibold">
                        {t.name}
                      </h3>
                      <p className="text-[13px] text-ink-soft">{t.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-line py-24" id="features">
          <div className="mx-auto max-w-wrap px-7">
            <SectionHead
              label="Everything included"
              title="Built for organisers, not engineers."
              sub="Every event — free or paid — gets the full toolkit. No add-ons to hunt down later."
            />
            <Reveal>
              <div className="grid gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-3">
                {FEATURES.map((f) => (
                  <div key={f.title} className="bg-white px-[30px] py-[34px]">
                    <div className="mb-[18px] flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-paper-shade font-display text-lg font-semibold text-gold-deep">
                      {f.icon}
                    </div>
                    <h3 className="mb-2 font-display text-[17px] font-semibold">
                      {f.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-soft">{f.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Showcase */}
        <section className="border-t border-line bg-paper-shade py-24">
          <div className="mx-auto max-w-wrap px-7">
            <SectionHead
              label="In the wild"
              title="Built for every kind of contest."
              sub="From school competitions to festival line-ups, the same engine adapts to the event."
            />
            <Reveal>
              <div className="flex gap-[18px] overflow-x-auto py-2">
                {SHOWCASE.map((s) => (
                  <div
                    key={s.name}
                    className="w-[280px] shrink-0 rounded-2xl border border-line bg-white p-[22px]"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-deep">
                      {s.label}
                    </span>
                    <h4 className="mb-2 mt-2.5 font-display text-xl font-semibold">
                      {s.name}
                    </h4>
                    {s.stats.map(([k, v]) => (
                      <div
                        key={k}
                        className="mt-4 flex justify-between border-t border-line pt-3.5 text-[13px] text-ink-soft"
                      >
                        <span>{k}</span>
                        <strong className="font-display text-base text-ink">{v}</strong>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-line py-24" id="pricing">
          <div className="mx-auto max-w-wrap px-7">
            <SectionHead
              label="Pricing"
              title="Free to start. Pay only when votes are sold."
              sub="No subscriptions, no setup fees. Voorna only takes a cut when your event takes a payment."
            />
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal className="h-full">
                <div className="flex h-full flex-col rounded-[20px] border border-line bg-white px-9 py-10">
                  <h3 className="mb-1.5 font-display text-[22px] font-semibold">
                    Free Voting
                  </h3>
                  <p className="text-sm text-ink-soft">
                    For events that don&apos;t sell votes.
                  </p>
                  <div className="my-6 font-display text-5xl font-semibold">
                    $0
                    <span className="font-sans text-base font-normal text-ink-soft">
                      {" "}
                      / forever
                    </span>
                  </div>
                  <ul className="mb-8 flex flex-col gap-[13px]">
                    {[
                      "Unlimited participants and votes",
                      "Full event website & branded voting page",
                      "\u201cPowered by Voorna\u201d badge on your public page",
                      "No card required to start",
                    ].map((li) => (
                      <li key={li} className="flex items-start gap-2.5 text-[14.5px]">
                        <span className="shrink-0 text-gold">—</span>
                        {li}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-line pt-6 text-[13px] text-ink-soft">
                    The Powered by Voorna badge links back to Voorna — every free
                    event helps the next organiser find us.
                  </div>
                </div>
              </Reveal>
              <Reveal className="h-full">
                <div className="flex h-full flex-col rounded-[20px] border border-ink bg-ink px-9 py-10 text-white">
                  <h3 className="mb-1.5 font-display text-[22px] font-semibold">
                    Paid Voting
                  </h3>
                  <p className="text-sm text-white/60">
                    For events selling vote packages.
                  </p>
                  <div className="my-6 font-display text-5xl font-semibold">
                    8%
                    <span className="font-sans text-base font-normal text-white/60">
                      {" "}
                      platform fee
                    </span>
                  </div>
                  <ul className="mb-8 flex flex-col gap-[13px]">
                    {[
                      "Everything in Free Voting",
                      "Sell vote packages via Stripe Connect",
                      "Stripe processing fees shown separately, never hidden",
                      "Remove Voorna branding once Stripe Connect is verified",
                    ].map((li) => (
                      <li key={li} className="flex items-start gap-2.5 text-[14.5px]">
                        <span className="shrink-0 text-gold">—</span>
                        {li}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-white/10 pt-6 text-[13px] text-white/60">
                    Example: a $100 vote purchase pays Voorna $8, plus standard
                    Stripe processing — the rest goes to your payout balance.
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-line bg-paper-shade py-24" id="faq">
          <div className="mx-auto max-w-wrap px-7">
            <SectionHead label="FAQ" title="Good to know before you launch." />
            <Reveal>
              <FaqAccordion items={FAQS} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
