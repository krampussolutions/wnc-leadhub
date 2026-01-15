-- Businesses (providers)
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid unique not null, -- Supabase auth user id
  business_name text not null,
  category text not null,
  phone text,
  email text,
  town text,
  created_at timestamptz not null default now(),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text not null default 'inactive'  -- inactive | active | past_due | canceled
);

-- Leads
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  message text not null,
  status text not null default 'new', -- new | contacted | closed
  created_at timestamptz not null default now()
);

-- =========================
-- RLS
-- =========================
alter table businesses enable row level security;
alter table leads enable row level security;

-- Business owner can read/update their business row
create policy "business_owner_select"
on businesses for select
using (owner_user_id = auth.uid());

create policy "business_owner_update"
on businesses for update
using (owner_user_id = auth.uid());

-- Business owner can read their leads
create policy "lead_owner_select"
on leads for select
using (
  exists (
    select 1 from businesses b
    where b.id = leads.business_id
      and b.owner_user_id = auth.uid()
  )
);

-- Nobody inserts leads directly from client (use backend)
-- So no insert policy here.

-- OPTIONAL: allow authenticated users to create their own business row
create policy "create_own_business"
on businesses for insert
with check (owner_user_id = auth.uid());
