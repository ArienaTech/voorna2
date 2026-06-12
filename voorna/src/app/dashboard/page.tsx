import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { DEMO_EVENT, DEMO_PARTICIPANTS } from "@/lib/demo-data";
import { formatMoney } from "@/lib/fees";
import { ArrowUpRight, Lock } from "lucide-react";

export const metadata = { title: "Dashboard — Voorna" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const demoMode = supabase === null;

  // With Supabase connected these come from real queries; in demo mode we
  // show the sample event so the dashboard is explorable immediately.
  const totalVotes = DEMO_PARTICIPANTS.reduce((s, p) => s + p.vote_count, 0);
  const stats = [
    { label: "Active events", value: "1" },
    { label: "Total votes", value: totalVotes.toLocaleString() },
    { label: "Total revenue", value: formatMoney(412800) },
    { label: "Page views", value: "18,402" },
    { label: "Participants", value: String(DEMO_PARTICIPANTS.length) },
  ];

  return (
    <div className="space-y-8">
      {demoMode && (
        <p className="rounded-lg border border-gold/30 bg-gold-wash px-4 py-3 text-sm text-gold-deep">
          You&apos;re exploring with sample data. Connect Supabase (see README) to
          create real events.
        </p>
      )}

      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em]">Overview</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
          {stats.map((s) => (
            <Card key={s.label}>
              <p className="text-[12px] font-medium text-ink-faint">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums tracking-[-0.02em]">
                {s.value}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card id="events" className="p-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-semibold">Your events</h2>
            <Link href="/dashboard/events/new">
              <Button variant="secondary" size="sm">
                New event
              </Button>
            </Link>
          </div>
          <Link
            href={`/e/${DEMO_EVENT.slug}`}
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-paper-shade"
          >
            <div>
              <p className="font-medium">{DEMO_EVENT.name}</p>
              <p className="mt-0.5 text-[13px] text-ink-faint">
                {DEMO_EVENT.category_tag} · Hybrid voting · Ends 30 Aug 2026
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
              Active
              <ArrowUpRight className="ml-1 h-3.5 w-3.5 text-ink-faint" />
            </span>
          </Link>
        </Card>

        <div className="space-y-4">
          <Card id="payouts">
            <h2 className="font-semibold">Payouts</h2>
            <p className="mt-1 text-[13px] text-ink-soft">
              Connect a Stripe payout account to withdraw earnings from paid
              voting.
            </p>
            <Button variant="secondary" size="sm" className="mt-4 w-full" disabled>
              <Lock className="h-3.5 w-3.5" />
              Withdraw earnings
            </Button>
            <p className="mt-2 text-center text-[12px] text-ink-faint">
              Enabled after Stripe onboarding
            </p>
          </Card>
          <Card id="analytics">
            <h2 className="font-semibold">Top participant links</h2>
            <ul className="mt-3 space-y-2.5">
              {DEMO_PARTICIPANTS.slice(0, 3).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">{p.name}</span>
                  <span className="tabular-nums text-ink-faint">
                    {p.vote_count.toLocaleString()} votes
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
