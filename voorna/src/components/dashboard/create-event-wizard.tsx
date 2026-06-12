"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATE_LIST } from "@/lib/templates";
import {
  DEFAULT_VOTE_PACKAGES,
  EVENT_CATEGORIES,
  type FreeVoteLimit,
  type TemplateId,
  type VotingMode,
} from "@/lib/types";
import { cn, slugify } from "@/lib/utils";
import { formatMoney } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["Template", "Details", "Voting"] as const;

export function CreateEventWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [template, setTemplate] = useState<TemplateId>("pageant");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Pageant");
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [votingMode, setVotingMode] = useState<VotingMode>("free");
  const [freeLimit, setFreeLimit] = useState<FreeVoteLimit>("per_day");

  const slug = useMemo(() => slugify(name) || "your-event", [name]);
  const isCharity = category === "Charity";

  const detailsValid = name.trim().length >= 3 && (!endsAt || !startsAt || endsAt >= startsAt);

  async function publish() {
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      // Demo mode: no backend yet — show the demo event instead.
      router.push("/e/aurora-pageant-2026");
      return;
    }
    setPending(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }
      const { error } = await supabase.from("events").insert({
        slug,
        name: name.trim(),
        description: description.trim(),
        template,
        category_tag: category,
        status: "active",
        voting_mode: votingMode,
        free_vote_limit: freeLimit,
        vote_packages: DEFAULT_VOTE_PACKAGES,
        location: location || null,
        starts_at: startsAt || null,
        ends_at: endsAt || null,
        contact_email: contactEmail || null,
      });
      if (error) throw error;
      router.push(`/e/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the event. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                i <= step ? "bg-ink text-white" : "border border-line-strong text-ink-faint"
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-[13px] font-medium",
                i <= step ? "text-ink" : "text-ink-faint"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.015em]">
            Choose a template
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            This sets the look and language of your event site. You can customise
            colours afterward.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {TEMPLATE_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-colors",
                  template === t.id
                    ? "border-ink bg-white"
                    : "border-line bg-white hover:border-line-strong"
                )}
                aria-pressed={template === t.id}
              >
                <span
                  className="mb-3 block h-16 rounded-lg border"
                  style={{
                    background: t.theme.bg,
                    borderColor: t.theme.border,
                  }}
                >
                  <span
                    className="mx-3 mt-4 block h-2 w-16 rounded-full"
                    style={{ background: t.theme.accent }}
                  />
                  <span
                    className="mx-3 mt-2 block h-1.5 w-24 rounded-full opacity-40"
                    style={{ background: t.theme.text }}
                  />
                </span>
                <span className="block font-medium">{t.name}</span>
                <span className="mt-0.5 block text-[13px] text-ink-faint">
                  {t.tagline}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={() => setStep(1)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.015em]">Event details</h1>
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="ev-name">Event name</Label>
              <Input
                id="ev-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  template === "pageant" ? "Miss Aurora 2026" : "Harvest Fest Bake-Off"
                }
              />
              <p className="mt-1.5 text-[12px] text-ink-faint">
                Your page: voorna.com/e/<span className="text-ink-soft">{slug}</span>
              </p>
            </div>
            <div>
              <Label htmlFor="ev-desc">Description</Label>
              <textarea
                id="ev-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/5"
                placeholder="What is this event, and what are people voting for?"
              />
            </div>
            <div>
              <Label htmlFor="ev-cat">Category</Label>
              <select
                id="ev-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink/50 focus:outline-none"
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {isCharity && (
                <p className="mt-2 rounded-lg bg-gold-wash px-3 py-2 text-[12px] leading-relaxed text-gold-deep">
                  Heads up: vote purchases on charity events are receipted as vote
                  purchases, not tax-deductible donations. Voorna does not issue
                  donation receipts, and your event page will state this clearly.
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="ev-start">Start date</Label>
                <Input
                  id="ev-start"
                  type="date"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ev-end">End date</Label>
                <Input
                  id="ev-end"
                  type="date"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
                <p className="mt-1.5 text-[12px] text-ink-faint">
                  Voting locks automatically when the event ends.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="ev-loc">Location</Label>
                <Input
                  id="ev-loc"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Auckland, New Zealand"
                />
              </div>
              <div>
                <Label htmlFor="ev-email">Contact email</Label>
                <Input
                  id="ev-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="hello@yourevent.com"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button onClick={() => setStep(2)} disabled={!detailsValid}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.015em]">Voting setup</h1>
          <div className="mt-6 space-y-6">
            <div>
              <Label>Voting mode</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["free", "Free", "Voters vote at no cost, with limits you set."],
                    ["paid", "Paid", "Voters buy vote packages. You earn the revenue."],
                    ["hybrid", "Hybrid", "A free daily vote, plus paid packages on top."],
                  ] as const
                ).map(([mode, label, body]) => (
                  <button
                    key={mode}
                    onClick={() => setVotingMode(mode)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-colors",
                      votingMode === mode
                        ? "border-ink bg-white"
                        : "border-line bg-white hover:border-line-strong"
                    )}
                    aria-pressed={votingMode === mode}
                  >
                    <span className="block font-medium">{label}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-ink-faint">
                      {body}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {votingMode !== "paid" && (
              <div>
                <Label htmlFor="ev-limit">Free vote limit</Label>
                <select
                  id="ev-limit"
                  value={freeLimit}
                  onChange={(e) => setFreeLimit(e.target.value as FreeVoteLimit)}
                  className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-ink/50 focus:outline-none"
                >
                  <option value="per_day">One vote per day</option>
                  <option value="per_email">One vote per email</option>
                  <option value="per_account">One vote per account</option>
                </select>
              </div>
            )}

            {votingMode !== "free" && (
              <div>
                <Label>Vote packages</Label>
                <div className="overflow-hidden rounded-xl border border-line">
                  {DEFAULT_VOTE_PACKAGES.map((p) => (
                    <div
                      key={p.votes}
                      className="flex items-center justify-between border-b border-line bg-white px-4 py-2.5 text-sm last:border-0"
                    >
                      <span>
                        {p.votes} {p.votes === 1 ? "vote" : "votes"}
                      </span>
                      <span className="tabular-nums text-ink-soft">
                        {formatMoney(p.amount)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[12px] text-ink-faint">
                  Defaults shown — you can customise packages once the event is
                  created. Voorna takes 8% of vote sales; Stripe&apos;s processing
                  fee is shown separately in your dashboard.
                </p>
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
                {error}
              </p>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={publish} disabled={pending}>
              {pending ? "Publishing…" : "Publish event"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
