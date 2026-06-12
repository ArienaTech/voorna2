import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Free-vote endpoint.
 *
 * v1 enforcement (spec → Fraud Protection):
 *  - event must be active and not past its end date
 *  - voting_mode must allow free votes
 *  - per-IP rate limit and per-day caps are enforced in the database via
 *    the `cast_free_vote` function (see supabase/migrations/0001_init.sql)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    // Demo mode — accept and discard so the UI flow works end to end.
    return NextResponse.json({ ok: true, demo: true });
  }

  let body: { participant_id?: string; ref?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.participant_id) {
    return NextResponse.json({ error: "participant_id is required." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { data, error } = await supabase.rpc("cast_free_vote", {
    p_event_slug: slug,
    p_participant_id: body.participant_id,
    p_source_referral_code: body.ref ?? null,
    p_voter_ip: ip,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, vote_id: data });
}
