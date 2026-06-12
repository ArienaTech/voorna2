-- Voorna — initial schema (Spec v2)
-- Run with: supabase db push   (or paste into the Supabase SQL editor)

-- ============================================================ organisers
create table public.organisers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null default '',
  plan text not null default 'free' check (plan in ('free', 'pro')), -- Pro tier: schema-ready, not functional in v1
  stripe_connect_id text,
  stripe_onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create an organiser row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.organisers (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================ events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organiser_id uuid not null references public.organisers (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text not null default '',
  template text not null default 'custom' check (template in ('pageant', 'community', 'awards', 'custom')),
  category_tag text not null default 'Custom',
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  voting_mode text not null default 'free' check (voting_mode in ('free', 'paid', 'hybrid')),
  free_vote_limit text not null default 'per_day' check (free_vote_limit in ('per_day', 'per_email', 'per_account')),
  vote_packages jsonb not null default '[{"votes":1,"amount":100},{"votes":10,"amount":800},{"votes":25,"amount":1800},{"votes":50,"amount":3000},{"votes":100,"amount":5000}]',
  currency text not null default 'USD',
  logo_url text,
  banner_url text,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,
  contact_email text,
  social_links jsonb not null default '{}',
  show_vote_counts boolean not null default true,
  show_leaderboard boolean not null default true,
  sections jsonb not null default '{"hero":true,"about":true,"participants":true,"sponsors":false,"leaderboard":true,"voting":true,"faq":false,"contact":true}',
  created_at timestamptz not null default now()
);

create index events_organiser_idx on public.events (organiser_id);
create index events_status_idx on public.events (status);

-- ============================================================ participants
create table public.participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  number int,
  photo_url text,
  gallery_urls jsonb not null default '[]',
  bio text,
  instagram text,
  facebook text,
  tiktok text,
  status text not null default 'active' check (status in ('active', 'hidden', 'disqualified')),
  referral_code text not null default encode(gen_random_bytes(6), 'hex'),
  sort_order int not null default 0,
  vote_count int not null default 0, -- denormalised; maintained by cast/allocate functions
  created_at timestamptz not null default now(),
  unique (event_id, referral_code)
);

create index participants_event_idx on public.participants (event_id);

-- ============================================================ applications
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  bio text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'needs_info')),
  created_at timestamptz not null default now()
);

-- ============================================================ votes
create table public.votes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  participant_id uuid not null references public.participants (id) on delete cascade,
  kind text not null check (kind in ('free', 'paid')),
  quantity int not null default 1 check (quantity > 0),
  source_referral_code text,
  voter_ip inet,
  voter_email text,
  voter_user_id uuid references auth.users (id),
  transaction_id uuid,
  created_at timestamptz not null default now()
);

create index votes_event_idx on public.votes (event_id, created_at);
create index votes_participant_idx on public.votes (participant_id);
create index votes_ip_idx on public.votes (event_id, voter_ip, created_at);

-- ============================================================ transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  participant_id uuid references public.participants (id),
  stripe_payment_intent text unique,
  gross_amount int not null,            -- cents
  voorna_fee int not null,              -- cents (8% default)
  stripe_fee_estimate int not null,     -- cents
  net_amount int not null,              -- cents
  currency text not null default 'USD',
  votes int not null,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'refunded', 'disputed')),
  created_at timestamptz not null default now()
);

-- ============================================================ sponsors
create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  logo_url text,
  website text,
  description text,
  sort_order int not null default 0
);

-- ============================================================ payouts & analytics
create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  organiser_id uuid not null references public.organisers (id) on delete cascade,
  stripe_payout_id text,
  amount int not null,
  currency text not null default 'USD',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.page_views (
  id bigint generated always as identity primary key,
  event_id uuid not null references public.events (id) on delete cascade,
  source_referral_code text,
  viewer_ip inet,
  created_at timestamptz not null default now()
);

create index page_views_event_idx on public.page_views (event_id, created_at);

-- ============================================================ settings
create table public.settings (
  key text primary key,
  value jsonb not null
);

insert into public.settings (key, value) values
  ('platform_fee_pct', '8'),
  ('free_vote_ip_daily_cap', '50'),
  ('free_vote_ip_cooldown_seconds', '10');

-- ============================================================ cast_free_vote
-- Enforces the anti-bot floor from the spec:
--   max 1 vote action per IP per 10 seconds
--   max 50 free votes per IP per day
--   one free vote per day per IP+participant (per_day mode baseline)
create or replace function public.cast_free_vote(
  p_event_slug text,
  p_participant_id uuid,
  p_source_referral_code text,
  p_voter_ip text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_event public.events%rowtype;
  v_ip inet := nullif(p_voter_ip, 'unknown')::inet;
  v_cooldown int := (select (value)::int from public.settings where key = 'free_vote_ip_cooldown_seconds');
  v_daily_cap int := (select (value)::int from public.settings where key = 'free_vote_ip_daily_cap');
  v_vote_id uuid;
begin
  select * into v_event from public.events where slug = p_event_slug;
  if not found then
    raise exception 'Event not found.';
  end if;
  if v_event.status <> 'active' or (v_event.ends_at is not null and v_event.ends_at < now()) then
    raise exception 'Voting has closed for this event.';
  end if;
  if v_event.voting_mode = 'paid' then
    raise exception 'This event accepts paid votes only.';
  end if;

  if v_ip is not null then
    -- 10-second cooldown per IP
    if exists (
      select 1 from public.votes
      where event_id = v_event.id and voter_ip = v_ip
        and created_at > now() - make_interval(secs => v_cooldown)
    ) then
      raise exception 'Please wait a moment before voting again.';
    end if;
    -- 50/day cap per IP
    if (
      select count(*) from public.votes
      where event_id = v_event.id and voter_ip = v_ip and kind = 'free'
        and created_at > now() - interval '1 day'
    ) >= v_daily_cap then
      raise exception 'Daily vote limit reached for this network.';
    end if;
    -- one free vote per participant per day per IP
    if v_event.free_vote_limit = 'per_day' and exists (
      select 1 from public.votes
      where event_id = v_event.id and participant_id = p_participant_id
        and voter_ip = v_ip and kind = 'free'
        and created_at > now() - interval '1 day'
    ) then
      raise exception 'You have already voted today. Come back tomorrow!';
    end if;
  end if;

  insert into public.votes (event_id, participant_id, kind, quantity, source_referral_code, voter_ip)
  values (v_event.id, p_participant_id, 'free', 1, p_source_referral_code, v_ip)
  returning id into v_vote_id;

  update public.participants set vote_count = vote_count + 1 where id = p_participant_id;

  return v_vote_id;
end;
$$;

-- ============================================================ row-level security
alter table public.organisers enable row level security;
alter table public.events enable row level security;
alter table public.participants enable row level security;
alter table public.applications enable row level security;
alter table public.votes enable row level security;
alter table public.transactions enable row level security;
alter table public.sponsors enable row level security;
alter table public.payouts enable row level security;
alter table public.page_views enable row level security;
alter table public.settings enable row level security;

-- Organisers can see/update their own record
create policy "own organiser row" on public.organisers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Events: public can read active/closed; organisers manage their own
create policy "public reads live events" on public.events
  for select using (status in ('active', 'closed'));
create policy "organisers manage own events" on public.events
  for all using (
    organiser_id in (select id from public.organisers where user_id = auth.uid())
  ) with check (
    organiser_id in (select id from public.organisers where user_id = auth.uid())
  );

-- Participants: public reads non-hidden on live events; organisers manage own
create policy "public reads participants" on public.participants
  for select using (
    status <> 'hidden' and event_id in (select id from public.events where status in ('active', 'closed'))
  );
create policy "organisers manage own participants" on public.participants
  for all using (
    event_id in (
      select e.id from public.events e
      join public.organisers o on o.id = e.organiser_id
      where o.user_id = auth.uid()
    )
  ) with check (
    event_id in (
      select e.id from public.events e
      join public.organisers o on o.id = e.organiser_id
      where o.user_id = auth.uid()
    )
  );

-- Applications: anyone can submit to an active event; organisers read/manage their own
create policy "public submits applications" on public.applications
  for insert with check (
    event_id in (select id from public.events where status = 'active')
  );
create policy "organisers manage own applications" on public.applications
  for all using (
    event_id in (
      select e.id from public.events e
      join public.organisers o on o.id = e.organiser_id
      where o.user_id = auth.uid()
    )
  );

-- Votes: written only via cast_free_vote / payment webhook (security definer);
-- organisers can read their events' votes
create policy "organisers read own votes" on public.votes
  for select using (
    event_id in (
      select e.id from public.events e
      join public.organisers o on o.id = e.organiser_id
      where o.user_id = auth.uid()
    )
  );

-- Transactions / payouts: organiser read-only (writes via service role)
create policy "organisers read own transactions" on public.transactions
  for select using (
    event_id in (
      select e.id from public.events e
      join public.organisers o on o.id = e.organiser_id
      where o.user_id = auth.uid()
    )
  );
create policy "organisers read own payouts" on public.payouts
  for select using (
    organiser_id in (select id from public.organisers where user_id = auth.uid())
  );

-- Sponsors: public read on live events; organisers manage own
create policy "public reads sponsors" on public.sponsors
  for select using (
    event_id in (select id from public.events where status in ('active', 'closed'))
  );
create policy "organisers manage own sponsors" on public.sponsors
  for all using (
    event_id in (
      select e.id from public.events e
      join public.organisers o on o.id = e.organiser_id
      where o.user_id = auth.uid()
    )
  );

-- Settings: readable by all authenticated users; writes via service role only
create policy "settings readable" on public.settings for select using (true);
