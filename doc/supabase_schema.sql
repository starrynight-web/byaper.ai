-- ============================================================
-- BYAPAR AI — COMPLETE SUPABASE SQL SCHEMA (FINAL MVP)
-- Run this ENTIRE block in your Supabase SQL Editor
-- ============================================================

-- 1. Enable extensions
create extension if not exists "uuid-ossp";

-- 2. USERS TABLE (mirrors auth.users)
create table if not exists public.users (
    id          uuid primary key references auth.users(id) on delete cascade,
    email       text unique not null,
    name        text,
    avatar_url  text,
    google_id   text,
    created_at  timestamptz default now() not null,
    last_login  timestamptz default now() not null
);

-- 3. BUSINESSES (multi-tenant workspaces)
create table if not exists public.businesses (
    id                  uuid primary key default uuid_generate_v4(),
    name                text not null,
    category            text,
    location            text,
    city                text,
    phone               text,
    website             text,
    services            jsonb,
    tone                text default 'professional',
    description         text,                          -- NEW: GBP advisor needs this
    opening_hours       jsonb,                         -- NEW: for FAQ auto-replies
    onboarding_complete boolean default false,
    meta_page_id        text,
    meta_access_token   text,
    gbp_location_id     text,
    gbp_access_token    text,
    created_at          timestamptz default now() not null
);

-- 4. WORKSPACE MEMBERS (RBAC)
create table if not exists public.workspace_members (
    id          uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade not null,
    user_id     uuid references public.users(id) on delete cascade not null,
    role        text not null check (role in ('owner', 'manager', 'viewer')),
    status      text not null default 'active',
    created_at  timestamptz default now() not null,
    unique(business_id, user_id)
);

-- 5. INVITATIONS
create table if not exists public.invitations (
    id          uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade not null,
    email       text not null,
    role        text not null check (role in ('owner', 'manager', 'viewer')),
    token       text unique not null,
    status      text not null default 'pending' check (status in ('pending', 'accepted', 'expired')),
    invited_by  uuid references public.users(id) on delete cascade not null,
    created_at  timestamptz default now() not null
);

-- 6. POSTS (Facebook + GBP)
create table if not exists public.posts (
    id               uuid primary key default uuid_generate_v4(),
    business_id      uuid references public.businesses(id) on delete cascade not null,
    content          text not null,
    image_url        text,
    image_prompt     text,                             -- NEW: stores the prompt used to generate image
    status           text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
    scheduled_time   timestamptz,
    platform         text not null default 'facebook' check (platform in ('facebook', 'gbp', 'instagram')),
    published_post_id text,
    error_message    text,                             -- NEW: store failure reason
    created_at       timestamptz default now() not null,
    updated_at       timestamptz default now() not null
);

-- 7. MESSAGES (Messenger inbox)
create table if not exists public.messages (
    id             uuid primary key default uuid_generate_v4(),
    business_id    uuid references public.businesses(id) on delete cascade not null,
    platform       text not null default 'messenger',
    sender_id      text not null,
    sender_name    text,
    message_text   text not null,
    ai_reply_draft text,
    reply_text     text,
    reply_status   text not null default 'pending' check (reply_status in ('pending', 'approved', 'sent', 'failed')),
    is_read        boolean default false,              -- NEW: unread badge support
    received_at    timestamptz default now() not null
);

-- 8. REVIEWS (Google + others)
create table if not exists public.reviews (
    id             uuid primary key default uuid_generate_v4(),
    business_id    uuid references public.businesses(id) on delete cascade not null,
    platform       text not null default 'google',
    review_id      text not null,
    reviewer_name  text,
    rating         integer not null check (rating between 1 and 5),
    review_text    text,
    ai_reply_draft text,
    posted_reply   text,
    reply_status   text not null default 'pending' check (reply_status in ('pending', 'posted', 'failed')),
    review_date    timestamptz not null,
    created_at     timestamptz default now() not null,
    unique(business_id, review_id)                    -- prevent duplicate imports
);

-- 9. AUTOMATIONS (feature toggles + config)
create table if not exists public.automations (
    id          uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade not null,
    type        text not null check (type in ('post_scheduler', 'review_reply', 'messenger_reply', 'gbp_updater')),
    enabled     boolean default false,
    config      jsonb default '{}',
    last_run_at timestamptz,                           -- NEW: display in automations UI
    created_at  timestamptz default now() not null,
    updated_at  timestamptz default now() not null,
    unique(business_id, type)
);

-- 10. ANALYTICS EVENTS (time-series)      -- NEW TABLE
create table if not exists public.analytics_events (
    id          uuid primary key default uuid_generate_v4(),
    business_id uuid references public.businesses(id) on delete cascade not null,
    event_type  text not null check (event_type in ('post_published', 'message_replied', 'review_replied', 'gbp_updated')),
    event_data  jsonb default '{}',
    created_at  timestamptz default now() not null
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.users              enable row level security;
alter table public.businesses         enable row level security;
alter table public.workspace_members  enable row level security;
alter table public.invitations        enable row level security;
alter table public.posts              enable row level security;
alter table public.messages           enable row level security;
alter table public.reviews            enable row level security;
alter table public.automations        enable row level security;
alter table public.analytics_events   enable row level security;

-- Drop old policies if re-running (safe to ignore errors)
drop policy if exists "Allow authenticated full access to users"             on public.users;
drop policy if exists "Allow authenticated full access to businesses"        on public.businesses;
drop policy if exists "Allow authenticated full access to workspace_members" on public.workspace_members;
drop policy if exists "Allow authenticated full access to invitations"       on public.invitations;
drop policy if exists "Allow authenticated full access to posts"             on public.posts;
drop policy if exists "Allow authenticated full access to messages"          on public.messages;
drop policy if exists "Allow authenticated full access to reviews"           on public.reviews;
drop policy if exists "Allow authenticated full access to automations"       on public.automations;

-- MVP: Full access for authenticated users (tighten after launch)
create policy "users_all"             on public.users             for all using (auth.role() = 'authenticated');
create policy "businesses_all"        on public.businesses        for all using (auth.role() = 'authenticated');
create policy "workspace_members_all" on public.workspace_members for all using (auth.role() = 'authenticated');
create policy "invitations_all"       on public.invitations       for all using (auth.role() = 'authenticated');
create policy "posts_all"             on public.posts             for all using (auth.role() = 'authenticated');
create policy "messages_all"          on public.messages          for all using (auth.role() = 'authenticated');
create policy "reviews_all"           on public.reviews           for all using (auth.role() = 'authenticated');
create policy "automations_all"       on public.automations       for all using (auth.role() = 'authenticated');
create policy "analytics_events_all"  on public.analytics_events  for all using (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGER: auto-create user profile on first sign-up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists idx_posts_business_id     on public.posts(business_id, status);
create index if not exists idx_messages_business_id  on public.messages(business_id, reply_status);
create index if not exists idx_reviews_business_id   on public.reviews(business_id, reply_status);
create index if not exists idx_analytics_business_id on public.analytics_events(business_id, event_type, created_at);
