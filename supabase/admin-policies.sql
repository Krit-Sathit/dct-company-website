-- Apply after schema.sql. This staging policy grants CMS access only to signed-in users.
-- Replace with role-based policies before adding more administrator accounts.
alter table site_settings enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table services enable row level security;
alter table certificates enable row level security;
alter table articles enable row level security;
alter table faqs enable row level security;
alter table rfqs enable row level security;
alter table rfq_items enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array['site_settings','categories','products','services','certificates','articles','faqs','rfqs','rfq_items'] loop
    execute format('drop policy if exists "authenticated_cms_access" on %I', table_name);
    execute format('create policy "authenticated_cms_access" on %I for all to authenticated using (true) with check (true)', table_name);
  end loop;
end $$;
