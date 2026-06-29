# KnowCode Academy — Website

Dynamic skill-development site (coding, design, gaming, vibe-coding) with a full admin panel.

**Stack:** Next.js 14 (App Router) · Supabase (DB + Auth + Storage) · MsgHex (WhatsApp) · Tailwind · deploy on Netlify.

## Features

- **Public site** — home with hero banner, course catalog (filter by category), course detail + application form, blog, contact page.
- **Course applications** — name, mobile, address, gender, age → saved to Supabase. Applicant gets an instant WhatsApp confirmation via MsgHex ("application received, we'll contact you").
- **Contact form** — saved to backend, viewable in admin.
- **Admin panel** (`/admin`, login-gated) — dashboard, CRUD for Courses / Blogs / Banners (with image upload), view + manage Applications and Contact messages.

---

## 1. Local setup

```bash
cd knowcode
npm install
cp .env.example .env.local   # then fill in real values (see below)
npm run dev                  # http://localhost:3000
```

## 2. Supabase

1. Create a project at [supabase.com](https://supabase.com) (browser login / CLI both fine).
2. Open **SQL Editor**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), run it. This creates all tables, RLS policies, and the public `media` storage bucket.
3. **Project Settings → API** — copy into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secret — server only)
4. Create the admin login: **Authentication → Users → Add user** (email + password). That's your `/admin` login.

> CLI alternative: `supabase login`, `supabase link`, `supabase db push`.

## 3. MsgHex (WhatsApp)

From the MsgHex Dashboard → **Settings → Developers**:
- `MSGHEX_API_SECRET` — an API key with `wa_send` permission (`dh_live_...`).
- `MSGHEX_SESSION_ID` — your connected device session ID (Devices page).
- `MSGHEX_APPLY_MESSAGE` — confirmation text; `{{name}}` is replaced with the applicant's name.

If these are blank, the site still works — it just skips the WhatsApp send (logs a warning).

## 4. Deploy to Netlify

```bash
npx netlify-cli login        # browser auth
npx netlify-cli init          # link/create site (build picked up from netlify.toml)
```

Then in **Netlify → Site settings → Environment variables**, add all the vars from `.env.local`
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`MSGHEX_API_SECRET`, `MSGHEX_SESSION_ID`, `MSGHEX_APPLY_MESSAGE`), then:

```bash
npx netlify-cli deploy --build --prod
```

The `@netlify/plugin-nextjs` plugin (in `netlify.toml`) handles SSR, API routes and middleware.

---

## Project map

```
src/
  app/
    (site)/            public site — home, courses, blog, contact
    admin/             login + dashboard + managers (auth-gated by middleware)
    api/
      apply/           POST: save application + MsgHex WhatsApp confirm
      contact/         POST: save contact message
      admin/[entity]/  POST upsert / DELETE for courses|blogs|banners|applications|contact_messages
      admin/upload/    POST: image upload → Supabase Storage (media bucket)
  components/          UI + admin managers
  lib/
    supabase/          client (browser) / server (cookies) / admin (service role)
    msghex.ts          WhatsApp send helper
    types.ts           shared types + categories
  middleware.ts        refreshes session + guards /admin
supabase/schema.sql    DB schema + RLS + storage bucket
```

## Notes

- **Logo:** rendered as a scalable SVG in `src/components/Logo.tsx`. To use the PNG instead, drop it in `public/` and swap the component.
- **Security:** the service-role key is only ever used in server code (`lib/supabase/admin.ts`, API routes). Never import it in client components.
- Admin reads use the service role (pages are already auth-gated by middleware); public reads use the anon key under RLS (published content + lead inserts only).
