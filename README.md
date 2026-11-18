# Rishab & Kunal — Video Editor Portfolio

Personal portfolio for a two-person video editing duo: an editorial, cinematic
site where the work is the main attraction, with a small admin for managing
projects, copy and client inquiries.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Postgres (`postgres`) · Vercel Blob · Zod. No UI or animation library.

---

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Deploying to Vercel](#deploying-to-vercel)
- [Managing content](#managing-content)
- [Videos and images](#videos-and-images)
- [Design system](#design-system)
- [Project structure](#project-structure)
- [SEO and accessibility](#seo-and-accessibility)
- [Security](#security)
- [Known limitations](#known-limitations)
- [Before launch checklist](#before-launch-checklist)

---

## Features

**Public site**

| Route | What it shows |
|---|---|
| `/` | Hero, selected work (asymmetric grid), showreel, services, about preview, contact call to action |
| `/work` | Full portfolio with category filters (`?category=` in the URL, shareable) and an empty state |
| `/work/[slug]` | Case study: video, overview, background, objective, approach, role, software, stills, related and next project |
| `/about` | Portraits, introduction, philosophy, approach, journey, software |
| `/services` | Each service with what you receive, what it suits, how it works, and a "Request a quote" link |
| `/contact` | Inquiry form (name, email, project type, budget, deadline, description) plus email, WhatsApp and socials |

- Custom video player for MP4/WebM: play/pause, seek, time, mute, fullscreen,
  keyboard shortcuts, `preload="none"`, one video at a time, pauses when
  scrolled away. YouTube and Vimeo load only after "Play".
- Contact form with validation, spam honeypot, rate limiting, and loading,
  success and error states. Inquiries are stored in the database.
- Testimonials appear only once a genuine one is published.

**Admin (`/admin`)**

Projects (create, edit, delete, thumbnail / poster / gallery upload),
categories, About and showreel, services, testimonials, and an inquiries inbox
with read/unread. Every change goes live immediately.

---

## Quick start

Requirements: **Node.js 20+** and **pnpm** (`corepack enable`).

```bash
pnpm install

# Create admin credentials (prints two lines)
pnpm admin:hash "choose-a-long-password"
```

Create `.env.local` in the project root:

```bash
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD_HASH=scrypt:...   # from admin:hash
SESSION_SECRET=...               # from admin:hash
```

```bash
pnpm dev
```

- Site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

**No database setup is needed locally.** Without `DATABASE_URL` the app runs
[PGlite](https://pglite.dev) (Postgres compiled to WASM) and stores data in
`.data/`. It creates the tables and starter content on first request. Delete
`.data/` any time to start fresh.

---

## Scripts

| Command | Does |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm admin:hash "password"` | Prints `ADMIN_PASSWORD_HASH` and a fresh `SESSION_SECRET` |

---

## Environment variables

Documented in [`.env.example`](.env.example). Nothing is required to run
locally except the three admin variables (to log in).

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical domain for canonical URLs, sitemap, Open Graph, JSON-LD |
| `NEXT_PUBLIC_ALLOW_INDEXING` | No | Set `false` on preview/staging to block search engines |
| `DATABASE_URL` | Production | Postgres connection string (use the **pooled** URL) |
| `BLOB_READ_WRITE_TOKEN` | Production, for uploads | Vercel Blob token for thumbnail/photo uploads |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD_HASH` | Yes | From `pnpm admin:hash` (the password itself is never stored) |
| `SESSION_SECRET` | Yes | 32+ random characters, from `pnpm admin:hash` |

The password hash uses `:` separators on purpose: Next.js expands `$` in
`.env` files, which would corrupt a `$`-separated hash.

---

## Deploying to Vercel

1. Push the repository and import it in Vercel.
2. **Storage → Create Database → Neon (Postgres)** and connect it to the
   project. This sets `DATABASE_URL`. (Supabase or any Postgres works too: use
   the pooled connection string.)
3. **Storage → Create → Blob** and connect it. This sets
   `BLOB_READ_WRITE_TOKEN`.
4. **Settings → Environment Variables**: add `ADMIN_EMAIL`,
   `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL`.
5. Deploy. Tables are created and the starter content is seeded on the first
   request. Schema changes are additive (`add column if not exists`), so
   redeploying never needs a manual migration.

Without `DATABASE_URL` the deployed site still renders the starter content
read-only, and the admin shows a "no database" warning.

---

## Managing content

Everything is edited in `/admin`:

| Admin page | Controls |
|---|---|
| **Projects** | Title, category, year, optional client, format, short and full description, background, objective, approach, role, software, video link, aspect ratio, duration, thumbnail, poster, gallery stills, SEO title/description, featured, published, order |
| **Categories** | The filters on `/work` (empty categories show an empty state) |
| **About & showreel** | Names, portraits, bios, hero copy, philosophy, approach, journey, what's different, software, email, phone, WhatsApp, social links, showreel link and poster |
| **Services** | Title, short description, what the client receives, what it suits, process |
| **Testimonials** | Hidden on the site until one is published. Only add genuine feedback, with permission |
| **Inquiries** | Every contact form submission, with project type, budget and deadline |

### Starter content

The six projects shipped with the site are **placeholders**. They have no
thumbnails and no video, so the site shows clearly labelled placeholder frames
rather than borrowed imagery. The admin marks them "Placeholder"; saving a
project removes the flag. Replace them with real work before launch.

The profile copy is first person plural ("we") because this is a duo. Change
any of it in **About & showreel**.

---

## Videos and images

- **Videos are never stored in the repo or uploaded through the app.** Host
  them on YouTube, Vimeo (unlisted works) or Vercel Blob / any CDN, and paste
  the link into the project. `*.mp4`, `*.mov`, `*.webm` and `public/videos/`
  are git-ignored.
- **MP4 / WebM links** get the custom player. **YouTube / Vimeo** use the
  provider's player after "Play" (their players can't be fully restyled).
- **YouTube links** fill in the thumbnail automatically if you don't upload one.
- **Uploads** (thumbnail, poster, gallery, portraits): JPG, PNG, WebP or AVIF,
  up to 4 MB. The file type is checked from its bytes, not its name.
- Images are served through `next/image` (resized, lazy-loaded, modern formats)
  for local files, Vercel Blob and YouTube thumbnails; any other pasted URL is
  shown unoptimised.

---

## Design system

Defined as Tailwind theme tokens in [`src/app/globals.css`](src/app/globals.css).

**Colour**

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F5F3EE` | Page background |
| `ink` | `#171717` | Text, primary button |
| `secondary` | `#77736D` | Large text (18px+) or text on white |
| `secondary-aa` | `#6E6A64` | Small secondary text on the page background (4.85:1, WCAG AA) |
| `muted` | `#96918A` | Non-text details, and text on the dark media background |
| `accent` | `#A64D32` | Sparing highlights: "Let's Talk", active nav, form CTA |
| `accent-hover` | `#873D29` | Accent hover |
| `line` | `#D8D4CC` | Borders and rules |
| `surface` | `#FFFFFF` | Form fields, white panels |
| `media` | `#111111` | Video background, showreel band, placeholders |

`#77736D` measures 4.25:1 on the background, just under AA for small text,
so small secondary text uses `secondary-aa` instead.

**Type:** Archivo for headings (slightly condensed, uppercase), DM Sans for
body, IBM Plex Mono for labels and metadata. Italic is used once per heading
at most. Classes: `t-hero`, `t-page`, `t-section`, `t-project`, `t-meta`,
`t-lead`, `t-italic`.

**Layout:** 1440px max, 1280px content, 64 / 32 / 20px side padding
(`container-site`), 12-column grid (`grid-12`), section spacing
136 / 96 / 72px (`section`). Corners 2–6px. Borders instead of shadows.

**Motion:** 200ms transitions, a subtle image scale and arrow nudge on hover,
and a single 500ms fade-in for some sections. No scroll-jacking, parallax or
cursor effects. Everything respects `prefers-reduced-motion`.

---

## Project structure

```
src/
  app/
    (site)/              public pages: home, work, work/[slug], about, services, contact
    admin/               login, admin panel, actions.ts (every write)
    actions/inquiry.ts   contact form server action
    globals.css          design tokens and type scale
    layout.tsx           fonts and root metadata
    sitemap.ts, robots.ts, not-found.tsx
  components/
    layout/              Header, Footer, SectionHeading
    home/                Hero, FeaturedWork, Showreel, ServicesPreview, AboutPreview, ContactCTA, Testimonials
    portfolio/           ProjectCard, ProjectThumbnail, ProjectGrid (filters), ProjectMetadata, RelatedProjects
    about/               SoftwareList
    contact/             ContactForm, ContactDetails
    ui/                  VideoPlayer, Img, PlaceholderFrame, Reveal
    admin/               ProjectForm, ProfileForm, RowForm, ui
  lib/
    db.ts                Postgres in production, PGlite locally; schema, migrations, seeding
    content.ts           all reads (with starter-content fallback when there's no database)
    seed.ts              starter content
    types.ts             data types
    validation.ts        Zod schemas, form options
    video.ts             YouTube / Vimeo / file link parsing
    seo.ts               metadata and JSON-LD helpers
    upload.ts            image uploads (Vercel Blob, or public/uploads locally)
    auth/                session cookie, password hash, access checks
    env.ts, rate-limit.ts
  proxy.ts               redirects /admin to login without a session
scripts/
  hash-password.mjs      pnpm admin:hash
```

---

## SEO and accessibility

- Unique title, description and canonical URL per page; projects can override
  them with their own SEO fields.
- Open Graph and Twitter cards, `sitemap.xml` (includes every project),
  `robots.txt` (admin excluded), JSON-LD for the studio, breadcrumbs and
  project videos.
- Old URLs `/projects` and `/projects/:slug` redirect to `/work`.
- Semantic headings (one `h1` per page), skip link, visible focus states,
  labelled form fields with announced errors, keyboard-operable video controls
  with labels, WCAG AA text contrast, reduced-motion support.
- Public pages are static and refreshed instantly when the admin saves.

---

## Security

- The admin password is stored only as an scrypt hash; comparison is
  constant-time and always runs, so timing doesn't reveal the email.
- Sessions are HMAC-SHA256 signed, `HttpOnly`, `SameSite=Lax`, `Secure` in
  production, 7-day expiry.
- `proxy.ts` redirects early, but every admin page and every server action
  checks the session itself.
- Login and contact form are rate limited; the contact form has a honeypot.
- All input is validated with Zod; SQL uses parameterised queries only.

---

## Known limitations

- **Rate limiting is in-memory**, per server instance. On serverless it slows
  abuse rather than fully stopping it. Add Vercel WAF or an Upstash-based
  limiter if spam becomes a problem.
- **YouTube/Vimeo** use their own player controls.
- **Local uploads** (`public/uploads`) are served by `pnpm dev`; `pnpm start`
  only serves files that existed at build time. Production uses Vercel Blob.
- There's no email notification for new inquiries yet; check `/admin/inquiries`.

---

## Before launch checklist

- [ ] Replace the six placeholder projects with real work (video, thumbnail, case study)
- [ ] Add your showreel link and poster in **About & showreel**
- [ ] Check email, phone (currently a placeholder), WhatsApp number and social links
- [ ] Confirm the software list only includes tools you actually use
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain
- [ ] Use a strong admin password in production (different from your local one)
- [ ] Delete `public/videos/` and `public/images/showreel-poster.jpg` from your machine
      (third-party film assets; already git-ignored and unused)
