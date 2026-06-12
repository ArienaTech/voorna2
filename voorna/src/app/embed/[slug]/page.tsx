import { notFound } from "next/navigation";
import { TEMPLATES, themeVars } from "@/lib/templates";
import { DEMO_EVENT, DEMO_PARTICIPANTS } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import type { Participant, VoornaEvent } from "@/lib/types";
import { VotePanel } from "@/components/event/vote-panel";

/**
 * Lightweight embed (spec → Embed Widget). Organisers drop this into an
 * <iframe> on their own site:
 *
 *   <iframe src="https://voorna.com/embed/your-event" width="100%" height="640"></iframe>
 */
export default async function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  let event: VoornaEvent | null = null;
  let participants: Participant[] = [];

  if (supabase) {
    const { data } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
    if (data) {
      event = data as VoornaEvent;
      const { data: ps } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", event.id)
        .eq("status", "active")
        .order("sort_order");
      participants = (ps ?? []) as Participant[];
    }
  }
  if (!event && slug === DEMO_EVENT.slug) {
    event = DEMO_EVENT;
    participants = DEMO_PARTICIPANTS;
  }
  if (!event) notFound();

  const t = TEMPLATES[event.template];
  const closed =
    event.status === "closed" ||
    (event.ends_at !== null && new Date(event.ends_at) < new Date());

  return (
    <div
      style={{ ...themeVars(t.theme), background: "var(--ev-bg)", color: "var(--ev-text)" }}
      className="min-h-dvh px-4 py-6"
    >
      <VotePanel
        event={event}
        participants={participants}
        closed={closed}
        referralCode={null}
      />
      <p className="mt-6 text-center text-[12px]" style={{ color: "var(--ev-text-soft)" }}>
        <a href={`/e/${event.slug}`} target="_blank" className="underline underline-offset-2">
          Powered by Voorna
        </a>
      </p>
    </div>
  );
}
