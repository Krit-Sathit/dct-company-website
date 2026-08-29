-- ==============================================================================
-- DUANGCHAROEN INTERTRADE (DCT) - SUPABASE DATABASE SETUP SCRIPT
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Tables
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  sort_order int default 0,
  active boolean default true
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories on delete set null,
  name text not null,
  slug text unique not null,
  sku text,
  description text,
  cut_format text,
  packing text,
  storage text,
  recommended_use text,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  image_url text,
  active boolean default true
);

create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  document_url text,
  issued_date date,
  expiry_date date,
  active boolean default true
);

create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  published_at timestamptz,
  status text default 'published'
);

create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort_order int default 0,
  active boolean default true
);

create table if not exists rfqs (
  id uuid primary key default uuid_generate_v4(),
  reference text unique not null,
  status text not null default 'new',
  company_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  line_id text,
  address text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists rfq_items (
  id uuid primary key default uuid_generate_v4(),
  rfq_id uuid not null references rfqs on delete cascade,
  product_id uuid references products on delete set null,
  product_name text not null,
  sku text,
  quantity numeric not null check(quantity > 0),
  unit text not null,
  note text
);

-- 3. Row Level Security (Allow Full Access for Website & Admin)
alter table site_settings enable row level security;
drop policy if exists "Allow all access to site_settings" on site_settings;
create policy "Allow all access to site_settings" on site_settings for all using (true) with check (true);

alter table categories enable row level security;
drop policy if exists "Allow all access to categories" on categories;
create policy "Allow all access to categories" on categories for all using (true) with check (true);

alter table products enable row level security;
drop policy if exists "Allow all access to products" on products;
create policy "Allow all access to products" on products for all using (true) with check (true);

alter table services enable row level security;
drop policy if exists "Allow all access to services" on services;
create policy "Allow all access to services" on services for all using (true) with check (true);

alter table certificates enable row level security;
drop policy if exists "Allow all access to certificates" on certificates;
create policy "Allow all access to certificates" on certificates for all using (true) with check (true);

alter table articles enable row level security;
drop policy if exists "Allow all access to articles" on articles;
create policy "Allow all access to articles" on articles for all using (true) with check (true);

alter table faqs enable row level security;
drop policy if exists "Allow all access to faqs" on faqs;
create policy "Allow all access to faqs" on faqs for all using (true) with check (true);

alter table rfqs enable row level security;
drop policy if exists "Allow all access to rfqs" on rfqs;
create policy "Allow all access to rfqs" on rfqs for all using (true) with check (true);

alter table rfq_items enable row level security;
drop policy if exists "Allow all access to rfq_items" on rfq_items;
create policy "Allow all access to rfq_items" on rfq_items for all using (true) with check (true);

-- 4. Initial Default Data
insert into categories (name, slug, description, sort_order, active) values
('เนื้อหมูตัดแต่ง', 'trimmed-pork', 'หมวดหมู่เนื้อหมูตัดแต่ง สำหรับธุรกิจอาหาร', 1, true),
('ชิ้นส่วนพรีเมียม', 'premium-cuts', 'หมวดหมู่ชิ้นส่วนพรีเมียม สำหรับธุรกิจอาหาร', 2, true),
('สินค้าตามสเปก', 'custom-spec', 'หมวดหมู่สินค้าตามสเปก สำหรับธุรกิจอาหาร', 3, true)
on conflict (slug) do nothing;

insert into products (name, slug, sku, description, cut_format, packing, storage, recommended_use, image_url, active) values
('เนื้อหมูตัดแต่ง', 'trimmed-pork', 'DCT-PK-001', 'เนื้อสุกรคัดสรรสำหรับครัวกลางและธุรกิจอาหาร รองรับการตัดแต่งตามสเปก', 'Trim ตามสเปกลูกค้า', '5 กก. / Vacuum pack', 'แช่เย็นหรือแช่แข็งตามข้อตกลง', 'ครัวกลาง ร้านอาหาร และโรงงาน', 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1000&q=80', true),
('สามชั้นคัดเกรด', 'pork-belly', 'DCT-PK-014', 'สามชั้นคัดสัดส่วนชั้นเนื้อและไขมัน เพื่อความสม่ำเสมอในการปรุง', 'Whole / Slice / Custom cut', 'Vacuum pack ตามสเปก', 'แช่เย็นหรือแช่แข็ง', 'ร้านอาหาร ชาบู และผลิตภัณฑ์แปรรูป', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=1000&q=80', true),
('สันคอหมู', 'pork-neck', 'DCT-PK-022', 'สันคอหมูพร้อมปรับขนาดและความหนาสำหรับเมนูย่างหรือหมัก', 'Whole / Slice', '5 กก. / Custom', 'แช่เย็นหรือแช่แข็ง', 'ร้านอาหารและครัวกลาง', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=80', true),
('สันนอกหมู', 'loin', 'DCT-PK-031', 'เนื้อสันนอกตัดแต่งพร้อมใช้งาน สื่อสารสเปกเพื่อควบคุมต้นทุนได้ง่าย', 'Trim / Portion', 'Vacuum pack', 'แช่เย็นหรือแช่แข็ง', 'สเต๊ก หมูทอด และอาหารพร้อมปรุง', 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80', true),
('ซี่โครงหมู', 'ribs', 'DCT-PK-045', 'ซี่โครงหมูสำหรับเมนูอบ ตุ๋น และย่าง จัดรูปแบบตามการใช้งาน', 'Rack / Cut pieces', 'Custom pack', 'แช่เย็นหรือแช่แข็ง', 'ร้านอาหาร โรงแรม และครัวกลาง', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=80', true),
('หมูบดตามสเปก', 'mince', 'DCT-PK-060', 'กำหนดระดับการบดและสัดส่วนเนื้อ-ไขมันตามกระบวนการผลิตของคุณ', 'Mince ตามขนาดที่ตกลง', '1 / 5 กก. Vacuum', 'แช่เย็นหรือแช่แข็ง', 'โรงงานแปรรูปและครัวกลาง', 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1000&q=80', true)
on conflict (slug) do nothing;
