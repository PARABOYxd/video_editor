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
| `/` | Hero, social proof, showreel, selected work, services, process, testimonials, about, FAQ. Sections with no real data stay hidden |
| `/work` | Masonry grid with counted category filters (`?category=`, shareable); a "coming soon" card while there are fewer than four projects |
| `/work/[slug]` | Player, meta row, brief / approach / result, stills with lightbox, related work, previous and next |
| `/about` | Story, editor profiles, values, tools |
| `/services` | Included, deliverables, turnaround, price and quote link per service, plus a comparison table |
| `/contact` | Name, email, type, budget, deadline date, message, reference link, plus direct channels and response time |

- Custom video player for MP4/WebM: play/pause, seek, time, mute, fullscreen,
  keyboard shortcuts, `preload="none"`, one video at a time, pauses when
  scrolled away. YouTube and Vimeo load only after "Play".
- Contact form with validation, spam honeypot, rate limiting, and loading,
  success and error states. Inquiries are stored in the database.
- Testimonials appear only once a genuine one is published or filled in the config.
- A closing call to action above the footer on every page except `/contact`.
- Withdrawn project URLs answer `410 Gone` (`src/lib/retired.ts`, `src/proxy.ts`).

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

### Building on Windows

If `pnpm build` fails on `/_global-error` or `/admin` with
`Cannot read properties of null (reading 'useContext')`, the terminal was
opened with a lowercase drive letter (`c:\...`, which VS Code can do). React
then loads twice. Re-enter the folder with an uppercase drive first:

```bash
cd C:\Users\admin\Herd\Video_Editor
pnpm build
```

In Git Bash use `cd 'C:/Users/admin/Herd/Video_Editor'`. Linux builds (Vercel)
are not affected.

Restart `pnpm dev` after a schema change: columns are added when the database
is first opened.

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
| **Projects** | Title, category, year, optional client, format, short and full description, background, objective, approach, result, role, software, project type, footage source, captions, video link, aspect ratio, duration, thumbnail, poster, gallery stills, SEO title/description, featured, published, order |
| **Categories** | The filters on `/work` (empty categories show an empty state) |
| **About & showreel** | Names, portraits, bios, hero copy, philosophy, approach, journey, what's different, software, email, phone, WhatsApp, social links, showreel link and poster |
| **Services** | Title, short description, what the client receives, what it suits, process |
| **Testimonials** | Hidden on the site until one is published. Only add genuine feedback, with permission |
| **Inquiries** | Every contact form submission, with project type, budget and deadline |

### Content that isn't in the admin

[`src/config/content.ts`](src/config/content.ts) holds stats, client logos,
extra testimonials, the process steps, FAQ, service inclusions, prices,
turnaround, values and response time. Empty values stay off the site and out of
structured data. Search the file for `TODO`.

To be emailed about new inquiries, implement `src/lib/notify.ts`.

### Starter content

There are no starter projects and no starter showreel. An empty portfolio
shows a "New work coming soon" card, and without a showreel that block is
hidden.

### Only your own work

- Publish only edits you made. Never download or re-host another creator's
  video, poster or showreel.
- Set **Project type** on each project. Until it is set, structured data
  doesn't name the studio as creator.
  - `client`: commissioned work. Name a client only with their agreement.
  - `spec`: your own edit of **royalty-free or licensed** footage. It needs a
    **Footage source** (e.g. "Pexels") and shows a "Spec project" badge.
- Slugs and file names in `src/lib/retired.ts` were withdrawn. They stay off
  the public site and can't be saved again, so don't remove entries from it.

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

Every token lives in the `@theme` block of [`src/app/globals.css`](src/app/globals.css).
Use the tokens, never raw values.

**Colour**

| Token | Hex | Use |
|---|---|---|
| `paper` | `#F5F3EE` | Page background |
| `surface` | `#FFFFFF` | Form fields, white panels |
| `media` / `scrim` | `#111111` / `#000000` | Video background / overlays on media |
| `ink` | `#171717` | Primary text, primary button |
| `secondary` | `#6E6A64` | Secondary text at any size (4.85:1 on paper, WCAG AA) |
| `muted` | `#96918A` | Decoration on paper, text only on `media` |
| `on-dark` | `#FFFFFF` | Text and icons on dark or accent backgrounds |
| `line` | `#D8D4CC` | Borders and rules |
| `accent` / `accent-hover` | `#A64D32` / `#873D29` | Sparing highlights |
| `danger`, `success`, `warning*` | | Status messages |

`src/config/theme.ts` repeats the few colours that CSS variables can't reach.

**Fonts:** subsets in `src/app/fonts` (weights 400-700 only; licences alongside).
A weight or script outside that needs a new subset.

**Type:** Archivo for headings (condensed, uppercase, with one italic word at
most), DM Sans for body, IBM Plex Mono for labels. Fluid classes: `t-display`,
`t-h1`, `t-h2`, `t-h3`, `t-h4`, `t-statement`, `t-quote`, `t-lead`, `t-prose`.
Fixed utilities: `text-body-lg`, `text-body`, `text-body-sm`, `text-small`,
`text-label`, `text-caption`. Long copy stops at `65ch`.

**Space:** 4px steps, plus fluid `gutter`, `grid`, `section`, `block`,
`page-top` and `page-bottom`. **Layers:** `z-float`, `z-header`, `z-overlay`, `z-skip`.
**Timing:** `duration-fast`, `base`, `slow`, `drawer`, `slower`.

**Components** (`src/components/ui`): `Button`, `Badge`, `Card`, `Container`,
`Section`, `SectionHeader`, `Eyebrow`.

**Motion:** the header hides on scroll down and returns on scroll up. Mark a
block `data-reveal`, or a list `data-reveal-group`, for a scroll reveal.
`data-cursor="Play"` gives the custom cursor (mouse only). Route changes fade.
Hover previews are desktop only. All of it is off with `prefers-reduced-motion`.

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
    og/[page]/           generated share images
    sitemap.ts, robots.ts, manifest.ts, not-found.tsx, error.tsx, global-error.tsx
  components/
    layout/              Header, Footer, ClosingCTA, BackToTop, Logo
    motion/              ScrollReveal, PageTransition, CustomCursor
    seo/                 JsonLd
    home/                Hero, ReelLightbox, FeaturedWork, ServicesPreview, AboutPreview, Testimonials
    portfolio/           ProjectCard, ComingSoonCard, ProjectThumbnail, ProjectGrid (filters), ProjectMetadata, RelatedProjects
    about/               SoftwareList
    contact/             ContactForm, ContactDetails
    ui/                  VideoPlayer, HoverVideo, Img, PlaceholderFrame, Button, Badge, Card, Section
    admin/               ProjectForm, ProfileForm, RowForm, ui
  config/                content.ts (placeholders), location.ts, theme.ts
  lib/
    inquiry.ts           contact form rules, shared by browser and server
    service-details.ts   services joined with config/content.ts
    notify.ts            TODO: inquiry emails
    retired.ts           withdrawn slugs and files
    db.ts                Postgres in production, PGlite locally; schema, migrations, seeding
    content.ts           all reads (seed profile and services when there's no database)
    seed.ts              starter content
    types.ts             data types
    validation.ts        Zod schemas for the admin
    video.ts             YouTube / Vimeo / file link parsing
    seo.ts               metadata and JSON-LD helpers
    upload.ts            image uploads (Vercel Blob, or public/uploads locally)
    auth/                session cookie, password hash, access checks
    env.ts, rate-limit.ts
  proxy.ts               410 for withdrawn URLs, /admin login redirect
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
- Old URLs `/projects` and `/projects/:slug` redirect to `/work`; withdrawn slugs answer 410.
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
- There's no email notification for new inquiries yet (`src/lib/notify.ts`); check `/admin/inquiries`.

---

## Before launch checklist

- [ ] Add your own projects (video, thumbnail, case study, project type)
- [ ] Add your showreel link and poster in **About & showreel**
- [ ] Check email, phone (currently a placeholder), WhatsApp number and social links
- [ ] Confirm the software list only includes tools you actually use
- [ ] Fill the TODOs in `src/config/content.ts` (see `CHECKLIST.md`)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain
- [ ] Use a strong admin password in production (different from your local one)
- [ ] Make sure no withdrawn video is left in the R2 bucket, Blob store or old deployments
