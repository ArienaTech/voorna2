"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/templates";
import type { Participant, VoornaEvent } from "@/lib/types";
import { formatMoney } from "@/lib/fees";
import { Check, Link2 } from "lucide-react";

interface Props {
  event: VoornaEvent;
  participants: Participant[];
  closed: boolean;
  referralCode: string | null;
}

export function VotePanel({ event, participants, closed, referralCode }: Props) {
  const t = TEMPLATES[event.template];
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [buyingFor, setBuyingFor] = useState<Participant | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(participants.map((p) => [p.id, p.vote_count]))
  );

  const canFreeVote = !closed && event.voting_mode !== "paid";
  const canBuyVotes = !closed && event.voting_mode !== "free";

  async function castFreeVote(p: Participant) {
    if (votedFor || closed) return;
    setVotedFor(p.id);
    setCounts((c) => ({ ...c, [p.id]: c[p.id] + 1 }));
    // Persist via API (no-op until Supabase is connected; UI stays optimistic)
    fetch(`/api/events/${event.slug}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participant_id: p.id, ref: referralCode }),
    }).catch(() => {});
  }

  async function copyShareLink(p: Participant) {
    const url = `${window.location.origin}/e/${event.slug}?ref=${p.referral_code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(p.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard unavailable — show the URL instead
      window.prompt("Copy this share link:", url);
    }
  }

  const ranked = [...participants].sort((a, b) => counts[b.id] - counts[a.id]);

  return (
    <div>
      {event.show_leaderboard && (
        <h2
          className="mb-6 text-center text-2xl font-semibold tracking-[-0.02em]"
          style={{ fontFamily: "var(--ev-display)" }}
        >
          {t.terms.leaderboardTitle}
        </h2>
      )}

      <div className="grid gap-3">
        {ranked.map((p, i) => (
          <div
            key={p.id}
            className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              background: "var(--ev-surface)",
              border: "1px solid var(--ev-border)",
              borderRadius: "var(--ev-radius)",
            }}
          >
            <div className="flex items-center gap-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style={
                  i === 0 && event.show_leaderboard
                    ? { background: "var(--ev-accent)", color: "var(--ev-accent-fg)" }
                    : {
                        border: "1px solid var(--ev-border)",
                        color: "var(--ev-text-soft)",
                      }
                }
              >
                {event.show_leaderboard ? i + 1 : p.number ?? "•"}
              </span>
              <div>
                <p className="font-medium leading-tight">{p.name}</p>
                <div
                  className="mt-0.5 flex items-center gap-3 text-[12px]"
                  style={{ color: "var(--ev-text-soft)" }}
                >
                  {p.number !== null && <span>{t.terms.participant} #{p.number}</span>}
                  {event.show_vote_counts && (
                    <span className="tabular-nums">
                      {counts[p.id].toLocaleString()} votes
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyShareLink(p)}
                className="flex h-9 w-9 items-center justify-center transition-opacity hover:opacity-70"
                style={{
                  border: "1px solid var(--ev-border)",
                  borderRadius: "var(--ev-radius)",
                  color: "var(--ev-text-soft)",
                }}
                aria-label={`Copy share link for ${p.name}`}
                title="Copy share link"
              >
                {copied === p.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </button>
              {canBuyVotes && (
                <button
                  onClick={() => setBuyingFor(p)}
                  className="h-9 px-4 text-[13px] font-semibold transition-opacity hover:opacity-85"
                  style={{
                    background: "var(--ev-accent)",
                    color: "var(--ev-accent-fg)",
                    borderRadius: "var(--ev-radius)",
                  }}
                >
                  Buy votes
                </button>
              )}
              {canFreeVote && (
                <button
                  onClick={() => castFreeVote(p)}
                  disabled={votedFor !== null}
                  className="h-9 px-4 text-[13px] font-semibold transition-opacity hover:opacity-85 disabled:opacity-40"
                  style={
                    canBuyVotes
                      ? {
                          border: "1px solid var(--ev-accent)",
                          color: "var(--ev-accent)",
                          borderRadius: "var(--ev-radius)",
                          background: "transparent",
                        }
                      : {
                          background: "var(--ev-accent)",
                          color: "var(--ev-accent-fg)",
                          borderRadius: "var(--ev-radius)",
                        }
                  }
                >
                  {votedFor === p.id ? "Voted ✓" : t.terms.voteCta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {votedFor && (
        <p
          className="mt-5 text-center text-sm"
          style={{ color: "var(--ev-text-soft)" }}
        >
          Thanks — your vote is in. Come back tomorrow to vote again.
        </p>
      )}

      {/* Vote purchase sheet */}
      {buyingFor && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setBuyingFor(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Buy votes for ${buyingFor.name}`}
        >
          <div
            className="w-full max-w-md p-6"
            style={{
              background: "var(--ev-surface)",
              border: "1px solid var(--ev-border)",
              borderRadius: "max(var(--ev-radius), 12px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-lg font-semibold tracking-[-0.015em]"
              style={{ fontFamily: "var(--ev-display)" }}
            >
              Buy votes for {buyingFor.name}
            </h3>
            <div className="mt-4 grid gap-2">
              {event.vote_packages.map((pkg) => (
                <button
                  key={pkg.votes}
                  className="flex items-center justify-between px-4 py-3 text-sm transition-opacity hover:opacity-80"
                  style={{
                    border: "1px solid var(--ev-border)",
                    borderRadius: "var(--ev-radius)",
                  }}
                  onClick={() => {
                    // Stripe Checkout session creation lands in the payments PR.
                    window.alert(
                      "Checkout opens here once Stripe is connected — see README → Payments."
                    );
                  }}
                >
                  <span className="font-medium">
                    {pkg.votes} {pkg.votes === 1 ? "vote" : "votes"}
                  </span>
                  <span className="tabular-nums" style={{ color: "var(--ev-text-soft)" }}>
                    {formatMoney(pkg.amount, event.currency)}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-relaxed" style={{ color: "var(--ev-text-soft)" }}>
              Votes are a digital good, allocated immediately upon payment, and
              are non-refundable.
            </p>
            <button
              className="mt-4 w-full py-2 text-center text-[13px] font-medium underline-offset-4 hover:underline"
              style={{ color: "var(--ev-text-soft)" }}
              onClick={() => setBuyingFor(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
