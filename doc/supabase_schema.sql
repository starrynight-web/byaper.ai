-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    name text,
    avatar_url text,
    google_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_login timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BUSINESSES (Workspaces) TABLE
create table if not exists businesses (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    category text,
    location text,
    city text,
    phone text,
    website text,
    services jsonb,
    tone text default 'professional',
    onboarding_complete boolean default false,
    meta_page_id text,
    meta_access_token text,
    gbp_location_id text,
    gbp_access_token text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WORKSPACE MEMBERS TABLE
create table if not exists workspace_members (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade not null,
    role text not null check (role in ('owner', 'manager', 'viewer')),
    status text not null default 'active',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(business_id, user_id)
);

-- INVITATIONS TABLE
create table if not exists invitations (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id) on delete cascade not null,
    email text not null,
    role text not null check (role in ('owner', 'manager', 'viewer')),
    token text unique not null,
    status text not null default 'pending',
    invited_by uuid references users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- POSTS TABLE
create table if not exists posts (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id) on delete cascade not null,
    content text not null,
    image_url text,
    status text not null check (status in ('draft', 'scheduled', 'published', 'failed')),
    scheduled_time timestamp with time zone,
    platform text not null default 'facebook',
    published_post_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MESSAGES TABLE
create table if not exists messages (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id) on delete cascade not null,
    platform text not null default 'messenger',
    sender_id text not null,
    sender_name text,
    message_text text not null,
    ai_reply_draft text,
    reply_text text,
    reply_status text not null check (reply_status in ('pending', 'approved', 'sent', 'failed')),
    received_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- REVIEWS TABLE
create table if not exists reviews (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id) on delete cascade not null,
    platform text not null default 'google',
    review_id text not null,
    reviewer_name text,
    rating integer not null,
    review_text text,
    ai_reply_draft text,
    posted_reply text,
    reply_status text not null check (reply_status in ('pending', 'posted', 'failed')),
    review_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- AUTOMATIONS TABLE
create table if not exists automations (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses(id) on delete cascade not null,
    type text not null check (type in ('post_scheduler', 'review_reply', 'messenger_reply')),
    enabled boolean default false,
    config jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(business_id, type)
);

-- Set up Row Level Security (RLS)
alter table users enable row level security;
alter table businesses enable row level security;
alter table workspace_members enable row level security;
alter table invitations enable row level security;
alter table posts enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;
alter table automations enable row level security;

-- Basic RLS Policies (For now, allow all authenticated users to read/write for MVP)
create policy "Allow authenticated full access to users" on users for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to businesses" on businesses for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to workspace_members" on workspace_members for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to invitations" on invitations for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to posts" on posts for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to messages" on messages for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to reviews" on reviews for all using (auth.role() = 'authenticated');
create policy "Allow authenticated full access to automations" on automations for all using (auth.role() = 'authenticated');
