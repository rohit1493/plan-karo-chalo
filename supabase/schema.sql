-- =============================================
-- PLAN KARO CHALO — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

create extension if not exists "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

create table public.trips (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  created_by      uuid,
  invite_code     text unique not null,
  current_stage   smallint not null default 0 check (current_stage between 0 and 3),
  tree_health     smallint not null default 0 check (tree_health between 0 and 100),
  status          text not null default 'planning' check (status in ('planning', 'confirmed')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table public.members (
  id          uuid primary key default uuid_generate_v4(),
  trip_id     uuid not null references public.trips(id) on delete cascade,
  name        text not null,
  session_id  text not null,
  role        text not null default 'contributor'
                check (role in ('primary_planner', 'secondary_planner', 'contributor')),
  joined_at   timestamptz not null default now(),
  unique(trip_id, session_id)
);

-- Deferred FK: trips.created_by → members.id
alter table public.trips
  add constraint trips_created_by_fkey
  foreign key (created_by) references public.members(id) on delete set null;

create table public.stages (
  id               uuid primary key default uuid_generate_v4(),
  trip_id          uuid not null references public.trips(id) on delete cascade,
  "order"          smallint not null check ("order" between 0 and 3),
  type             text not null check (type in ('date', 'location', 'stay', 'activity')),
  is_locked        boolean not null default false,
  locked_option_id uuid,
  locked_at        timestamptz,
  unique(trip_id, "order")
);

create table public.options (
  id          uuid primary key default uuid_generate_v4(),
  stage_id    uuid not null references public.stages(id) on delete cascade,
  title       text not null,
  link        text,
  notes       text,
  added_by    uuid references public.members(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.stages
  add constraint stages_locked_option_id_fkey
  foreign key (locked_option_id) references public.options(id) on delete set null;

create table public.votes (
  id          uuid primary key default uuid_generate_v4(),
  option_id   uuid not null references public.options(id) on delete cascade,
  member_id   uuid not null references public.members(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(option_id, member_id)
);

-- =============================================
-- INDEXES
-- =============================================

create index on public.members(trip_id);
create index on public.members(session_id);
create index on public.stages(trip_id, "order");
create index on public.options(stage_id);
create index on public.votes(option_id);
create index on public.votes(member_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_updated_at
  before update on public.trips
  for each row execute function public.set_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.trips   enable row level security;
alter table public.members enable row level security;
alter table public.stages  enable row level security;
alter table public.options enable row level security;
alter table public.votes   enable row level security;

-- TRIPS: public read only (writes go through Edge Function with service role)
create policy "trips_read_all" on public.trips for select using (true);

-- MEMBERS: public read, open insert (zero-friction join)
create policy "members_read_all" on public.members for select using (true);
create policy "members_insert_open" on public.members for insert with check (true);

-- STAGES: public read only (locks go through Edge Function)
create policy "stages_read_all" on public.stages for select using (true);

-- OPTIONS: public read, planner-only insert/delete
create policy "options_read_all" on public.options for select using (true);

create policy "options_insert_planner" on public.options for insert
  with check (
    exists (
      select 1 from public.stages s
      join public.members m on m.trip_id = s.trip_id
      where s.id = options.stage_id
        and m.id = options.added_by
        and m.role in ('primary_planner', 'secondary_planner')
        and s.is_locked = false
    )
  );

create policy "options_delete_planner" on public.options for delete
  using (
    exists (
      select 1 from public.stages s
      join public.members m on m.trip_id = s.trip_id
      where s.id = options.stage_id
        and m.id = options.added_by
        and m.role in ('primary_planner', 'secondary_planner')
        and s.is_locked = false
    )
  );

-- VOTES: public read, any member can vote on unlocked stages, own delete only
create policy "votes_read_all" on public.votes for select using (true);

create policy "votes_insert_any_member" on public.votes for insert
  with check (
    exists (
      select 1 from public.options o
      join public.stages s on s.id = o.stage_id
      where o.id = votes.option_id
        and s.is_locked = false
    )
  );

create policy "votes_delete_own" on public.votes for delete
  using (member_id = votes.member_id);

-- =============================================
-- RPC: create_trip (atomic: trip + member + stages)
-- Avoids circular FK problem with created_by
-- =============================================

create or replace function public.create_trip(
  p_name         text,
  p_planner_name text,
  p_invite_code  text,
  p_session_id   text,
  p_first_stage  text  -- 'date' or 'location'
)
returns json
language plpgsql
security definer
as $$
declare
  v_trip_id   uuid;
  v_member_id uuid;
  v_stages    text[];
begin
  -- 1. Insert trip with created_by = null
  insert into public.trips(name, invite_code, created_by)
  values (p_name, p_invite_code, null)
  returning id into v_trip_id;

  -- 2. Insert planner member
  insert into public.members(trip_id, name, session_id, role)
  values (v_trip_id, p_planner_name, p_session_id, 'primary_planner')
  returning id into v_member_id;

  -- 3. Update trips.created_by
  update public.trips set created_by = v_member_id where id = v_trip_id;

  -- 4. Build stage order: first stage first, then the other date/location, then stay, activity
  if p_first_stage = 'date' then
    v_stages := array['date', 'location', 'stay', 'activity'];
  else
    v_stages := array['location', 'date', 'stay', 'activity'];
  end if;

  -- 5. Insert all 4 stages
  for i in 0..3 loop
    insert into public.stages(trip_id, "order", type)
    values (v_trip_id, i, v_stages[i + 1]);
  end loop;

  return json_build_object(
    'trip_id', v_trip_id,
    'member_id', v_member_id,
    'invite_code', p_invite_code
  );
end;
$$;

-- =============================================
-- Enable Realtime (run after enabling in Dashboard)
-- Dashboard → Database → Replication → enable for: members, votes, stages
-- =============================================
