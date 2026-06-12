import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TEMPLATES, themeVars } from "@/lib/templates";
import { DEMO_EVENT, DEMO_PARTICIPANTS } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { Participant, VoornaEvent } from "@/lib/types";
import { VotePanel } from "@/components/event/vote-panel";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}

async function getEvent(slug: string): Promise<{
  event: VoornaEvent;
  participants: Participant[];
} | null> {
  const supabase = await createClient();
  if (!supabase) {
    // Demo mode
    return slug === DEMO_EVENT.slug
      ? { event: DEMO_EVENT, participants: DEMO_PARTICIPANTS }
      : null;
  }
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!event) {
    return slug === DEMO_EVENT.slug
      ? { event: DEMO_EVENT, participants: DEMO_PARTICIPANTS }
      : null;
  }
  const { data: participants } = await supabase
    .from("participants")
    .select("*")
    .eq("event_id", event.id)
    .neq("status", "hidden")
    .order("sort_order");
  return { event: event as VoornaEvent, participants: (participants ?? []) as Participant[] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEvent(slug);
  if (!data) return { title: "Event not found — Voorna" };
  return {
    title: `${data.event.name} — Vote now`,
    description: data.event.description,
    openGraph: {
      title: `${data.event.name} — Vote now`,
      description: data.event.description,
      type: "website",
    },
  };
}

export default async function EventPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { ref } = await searchParams;
  const data = await getEvent(slug);
  if (!data) notFound();

  const { event, participants } = data;
  const t = TEMPLATES[event.template];
  const closed =
    event.status === "closed" ||
    (event.ends_at !== null && new Date(event.ends_at) < new Date());
  const ranked = [...participants]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.vote_count - a.vote_count);

  return (
    <div
      style={{
        ...themeVars(t.theme),
        background: "var(--ev-bg)",
        color: "var(--ev-text)",
      }}
      className="min-h-dvh"
    >
      {/* Hero */}
      <header className="mx-auto max-w-4xl px-5 pb-12 pt-16 text-center sm:pt-24">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--ev-accent)" }}
        >
          {closed ? "Voting has closed" : "Public voting open"}
        </p>
        <h1
          className="mt-4 text-[clamp(2.2rem,5vw+0.5rem,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
          style={{ fontFamily: "var(--ev-display)" }}
        >
          {event.name}
        </h1>
        {event.description && (
          <p
            className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed"
            style={{ color: "var(--ev-text-soft)" }}
          >
            {event.description}
          </p>
        )}
        <p className="mt-4 text-[13px]" style={{ color: "var(--ev-text-soft)" }}>
          {[event.location, event.ends_at && !closed
            ? `Voting closes ${new Date(event.ends_at).toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" })}`
            : null]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {/* Participants + voting */}
      <main className="mx-auto max-w-4xl px-5 pb-20">
        <VotePanel
          event={event}
          participants={ranked}
          closed={closed}
          referralCode={ref ?? null}
        />
      </main>

      {/* Powered by Voorna — free tier badge */}
      <footer
        className="border-t py-8 text-center"
        style={{ borderColor: "var(--ev-border)" }}
      >
        <Link
          href="/"
          className="text-[13px] underline-offset-4 hover:underline"
          style={{ color: "var(--ev-text-soft)" }}
        >
          Powered by <span className="font-semibold">Voorna</span> — create your
          own free voting event
        </Link>
      </footer>
    </div>
  );
}
