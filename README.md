# DCT B2B Food Supply Website

Staging website for Duangcharoen Intertrade Co., Ltd. Built with Next.js, TypeScript, a B2B product catalogue and RFQ workflow. The site intentionally does not display product prices or process payments.

## Run locally

1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill the Supabase and SMTP values when those services are ready. Do not commit `.env.local`.
3. Run `npm run dev`, then open `http://localhost:3000`.
4. Run quality checks with `npm run typecheck`, `npm run lint`, and `npm run build`.

## Staging behavior

- Without credentials, catalogue and content use realistic mock data from `lib/data.ts`.
- RFQ submission is validated in the browser and saved in LocalStorage so the complete demo flow can be tested. It generates a `DCT-RFQ-YYYYMMDD-XXXX` reference. The Admin Demo at `/admin` can view requests from the same browser.
- Before launch, replace the Demo persistence with server-side Supabase calls and protect `/admin` with Supabase Auth. The schema is ready at `supabase/schema.sql`.
- The current Supabase schema supports Company/Hero/Contact settings (`site_settings`), categories, products, services, certificates, articles, FAQs, RFQs, and line items. Configure authenticated administrator CRUD policies; public users should only read published/active records and submit RFQs through a protected server route.

## Supabase / email setup

1. Create a Supabase project manually, then run `supabase/schema.sql` and optional `supabase/seed.sql` in its SQL editor.
2. Create a private Storage bucket named `dct-media` for product, article, and certificate uploads.
3. Put only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in browser-visible configuration. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
4. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `RFQ_NOTIFY_TO` to enable an RFQ notification service. No email is sent while these are unset.

## Content and brand handoff

- All company facts marked as placeholders must be replaced in the CMS when verified information arrives.
- The standards page makes no claim of a current certificate and contains no fabricated reference number, date, or document.
- `public/logo-lockup.png` is a direct copy of the supplied raster lockup. No logo was recreated; use an original SVG/AI master if it becomes available.
- Replace external mock photography with licensed DCT imagery before production.

## Important routes

`/`, `/about`, `/products`, `/products/[id]`, `/services`, `/standards`, `/news`, `/news/[slug]`, `/faq`, `/contact`, `/rfq`, `/admin`
