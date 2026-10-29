-- Niagize dev database (winga-dev, zgpaitukibhmikhazgvk): full copy of the live schema as of 29 Oct 2026 (v2.20).
-- Generated from the live catalog (tables, constraints, indexes, functions, triggers, RLS, grants, storage, cron).
-- Differences from live, on purpose:
--   * the notify hook, the photo-order prefix and push keys point at the dev project (dev makes its own push keys)
--   * no team-brief cron jobs (no 09:30 / 13:30 / critical pushes from dev)
set check_function_bodies = off;

create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create schema if not exists private;

-- ---------------- tables ----------------
create sequence if not exists public.events_id_seq;
create sequence if not exists public.order_items_id_seq;

create table private.brief_sent (
  key text not null,
  at timestamp with time zone default now() not null
);
create table private.push_config (
  id integer default 1 not null,
  vapid_public text,
  vapid_private jsonb,
  hook_secret text default encode(extensions.gen_random_bytes(24), 'hex'::text) not null
);
create table public.addresses (
  id uuid default gen_random_uuid() not null,
  user_id uuid default auth.uid() not null,
  label text default ''::text not null,
  line text not null,
  landmark text,
  lat double precision,
  lng double precision,
  accepted_terms boolean default false not null,
  created_at timestamp with time zone default now() not null
);
create table public.admins (
  user_id uuid not null,
  name text,
  added_at timestamp with time zone default now(),
  role text default 'boss'::text not null
);
create table public.events (
  id bigint default nextval('public.events_id_seq'::regclass) not null,
  at timestamp with time zone default now() not null,
  type text not null,
  product_id uuid,
  session text
);
create table public.login_attempts (
  username text not null,
  fails integer default 0 not null,
  locked_until timestamp with time zone
);
create table public.order_items (
  id bigint default nextval('public.order_items_id_seq'::regclass) not null,
  order_id uuid not null,
  product_id uuid,
  name text not null,
  price integer,
  qty integer not null,
  thumb text,
  note text
);
create table public.order_private (
  order_id uuid not null,
  ganji integer default 0 not null,
  updated_at timestamp with time zone default now() not null,
  updated_by uuid default auth.uid(),
  items jsonb
);
create table public.orders (
  id uuid default gen_random_uuid() not null,
  code text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  customer_id uuid,
  customer_name text,
  customer_phone text,
  address jsonb,
  delivery text default 'fasta'::text not null,
  delivery_fee integer,
  subtotal integer default 0 not null,
  priced boolean default true not null,
  items_count integer default 0 not null,
  status text default 'new'::text not null,
  pay_ref text,
  pay_name text,
  cancel_reason text,
  handled_by uuid,
  history jsonb default '[]'::jsonb not null,
  agreed_total integer,
  seen_at timestamp with time zone,
  claim_ref text,
  claim_name text,
  claim_channel text,
  claim_at timestamp with time zone,
  rating smallint,
  rating_note text,
  received_at timestamp with time zone
);
create table public.product_private (
  product_id uuid not null,
  cost integer,
  supplier text,
  note text,
  ganji integer
);
create table public.products (
  id uuid default gen_random_uuid() not null,
  created_at timestamp with time zone default now() not null,
  refreshed_at timestamp with time zone default now() not null,
  name text not null,
  description text,
  category text default 'nyingine'::text not null,
  price integer,
  sizes text,
  colors text,
  images text[] default '{}'::text[] not null,
  thumbs text[] default '{}'::text[] not null,
  status text default 'active'::text not null,
  asks integer default 0 not null,
  created_by uuid default auth.uid(),
  subcategory text,
  tags text[] default '{}'::text[] not null,
  rating smallint default 2 not null,
  ordered integer default 0 not null,
  prev_price integer,
  price_drop_at timestamp with time zone
);
create table public.profiles (
  id uuid not null,
  username text not null,
  full_name text default ''::text not null,
  whatsapp text,
  email text,
  kind text default 'customer'::text not null,
  verified boolean default false not null,
  created_at timestamp with time zone default now() not null
);
create table public.push_subs (
  id uuid default gen_random_uuid() not null,
  user_id uuid default auth.uid() not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  app_url text,
  ua text,
  created_at timestamp with time zone default now() not null,
  last_ok timestamp with time zone,
  fails integer default 0 not null
);
create table public.shop (
  id integer default 1 not null,
  name text default 'Winga'::text not null,
  tagline text default 'Bidhaa za Kariakoo, mlangoni kwako'::text,
  whatsapp text,
  lipa text,
  lipa_name text,
  network text,
  instagram text,
  updated_at timestamp with time zone default now(),
  payments jsonb default '[]'::jsonb not null,
  fee_fasta integer,
  fee_leo integer,
  taxonomy jsonb
);
alter sequence public.events_id_seq owned by public.events.id;
alter sequence public.order_items_id_seq owned by public.order_items.id;

-- ---------------- constraints ----------------
alter table public.addresses add constraint addresses_pkey PRIMARY KEY (id);
alter table public.admins add constraint admins_pkey PRIMARY KEY (user_id);
alter table public.events add constraint events_pkey PRIMARY KEY (id);
alter table public.login_attempts add constraint login_attempts_pkey PRIMARY KEY (username);
alter table public.order_items add constraint order_items_pkey PRIMARY KEY (id);
alter table public.order_private add constraint order_private_pkey PRIMARY KEY (order_id);
alter table public.orders add constraint orders_pkey PRIMARY KEY (id);
alter table private.brief_sent add constraint brief_sent_pkey PRIMARY KEY (key);
alter table private.push_config add constraint push_config_pkey PRIMARY KEY (id);
alter table public.product_private add constraint product_private_pkey PRIMARY KEY (product_id);
alter table public.products add constraint products_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_pkey PRIMARY KEY (id);
alter table public.push_subs add constraint push_subs_pkey PRIMARY KEY (id);
alter table public.shop add constraint shop_pkey PRIMARY KEY (id);
alter table public.orders add constraint orders_code_key UNIQUE (code);
alter table public.profiles add constraint profiles_username_key UNIQUE (username);
alter table public.push_subs add constraint push_subs_endpoint_key UNIQUE (endpoint);
alter table public.addresses add constraint addresses_accepted_terms_check CHECK (accepted_terms);
alter table public.admins add constraint admins_role_check CHECK ((role = ANY (ARRAY['super_admin'::text, 'boss'::text, 'assistant'::text])));
alter table public.events add constraint events_type_check CHECK ((type = ANY (ARRAY['visit'::text, 'view'::text, 'cart'::text, 'chat'::text, 'order'::text])));
alter table public.order_items add constraint order_items_note_check CHECK (((note IS NULL) OR (length(note) <= 200)));
alter table public.order_items add constraint order_items_qty_check CHECK (((qty >= 1) AND (qty <= 99)));
alter table public.order_private add constraint order_private_ganji_check CHECK ((ganji >= 0));
alter table public.orders add constraint orders_delivery_check CHECK ((delivery = ANY (ARRAY['fasta'::text, 'leo'::text])));
alter table public.orders add constraint orders_agreed_total_check CHECK (((agreed_total IS NULL) OR (agreed_total >= 0)));
alter table public.orders add constraint orders_rating_check CHECK (((rating >= 1) AND (rating <= 5)));
alter table public.orders add constraint orders_status_check CHECK ((status = ANY (ARRAY['new'::text, 'progress'::text, 'invoiced'::text, 'paid'::text, 'done'::text, 'cancelled'::text])));
alter table private.push_config add constraint push_config_id_check CHECK ((id = 1));
alter table public.product_private add constraint product_private_ganji_check CHECK ((ganji >= 0));
alter table public.products add constraint products_rating_check CHECK (((rating >= 1) AND (rating <= 3)));
alter table public.products add constraint products_status_check CHECK ((status = ANY (ARRAY['active'::text, 'soldout'::text, 'hidden'::text, 'archived'::text])));
alter table public.profiles add constraint profiles_username_check CHECK ((username ~ '^[a-z0-9_.]{3,20}$'::text));
alter table public.profiles add constraint profiles_kind_check CHECK ((kind = ANY (ARRAY['customer'::text, 'staff'::text])));
alter table public.push_subs add constraint push_subs_endpoint_check CHECK ((endpoint ~ '^https://'::text));
alter table public.push_subs add constraint push_subs_app_url_check CHECK (((app_url IS NULL) OR (app_url ~ '^https?://'::text)));
alter table public.shop add constraint shop_id_check CHECK ((id = 1));
alter table public.addresses add constraint addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.admins add constraint admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.events add constraint events_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
alter table public.order_items add constraint order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
alter table public.order_items add constraint order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
alter table public.order_private add constraint order_private_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
alter table public.orders add constraint orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.product_private add constraint product_private_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
alter table public.profiles add constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.push_subs add constraint push_subs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX orders_created_idx ON public.orders USING btree (created_at DESC);
CREATE INDEX events_at_idx ON public.events USING btree (at DESC);
CREATE INDEX orders_customer_idx ON public.orders USING btree (customer_id);
CREATE INDEX products_live_idx ON public.products USING btree (status, refreshed_at DESC);
