# Launch checklist

What the redesign (phases 1–7) changed, what still needs you, and what was
left out on purpose. Last updated 2026-11-26.

## 1. Do these first

- [ ] **Delete the 9 withdrawn videos from the R2 bucket.** They are still
      public. Keys: `Upload/<name>.mp4` for each file name in
      `RETIRED_FILES` in [`src/lib/retired.ts`](src/lib/retired.ts), except
      `showreel-loop`. Don't upload them, or their `-720` / `-preview`
      versions, again.
- [ ] **Vercel:** purge the CDN and image cache, and delete deployments made
      before the removal. Old deployment URLs still serve the old site.
- [ ] **`/admin/projects`:** delete the 8 projects marked "Withdrawn · hidden
      from site", locally and in production.
- [ ] **Git history** still holds the old posters and titles. Make the
      repository private, or ask for a history rewrite plan.
- [ ] Set `NEXT_PUBLIC_SITE_URL` (and `DATABASE_URL`, so the contact form
      saves) in Vercel.
- [ ] Replace the placeholder phone and WhatsApp number (`+91 98000 00000`) in
      **/admin/about**. Until then it is left out of structured data.

## 2. Placeholders to fill in

All in [`src/config/content.ts`](src/config/content.ts). Anything left empty
stays hidden and out of structured data.

| What | Where | Until filled |
|---|---|---|
| Stats (projects, views, clients, years) | `STATS` | Strip hidden |
| Client logos (with permission), files in `public/logos` | `CLIENT_LOGOS` | Marquee hidden |
| Testimonials (genuine, with permission) | `TESTIMONIALS`, or /admin/testimonials | Section hidden |
| FAQ answers: turnaround, revision rounds, formats, footage transfer, payment | `FAQ` | Neutral answers with no numbers |
| Starting price per service | `SERVICE_EXTRAS[*].startingPrice` | "Quoted per project", no Offer schema |
| Turnaround per service | `SERVICE_EXTRAS[*].turnaround` | "Confirmed with your quote" |
| Price range | `PRICE_RANGE` | Left out of schema |
| Values (drawn from your About copy) | `VALUES` | Shown as written; confirm |
| Contact response time | `RESPONSE_TIME` | Neutral line, no promise |
| Copy change date for the sitemap | `CONTENT_UPDATED` | 2026-11-22 |
| Email on new inquiries | [`src/lib/notify.ts`](src/lib/notify.ts) | Inquiries only in /admin/inquiries |

Also confirm in /admin/about: "working with YouTube creators, brands and
agencies", "Two years of hands-on editing", the software list, and the
availability line (it drives the "Available for projects" pill).

## 3. Your own work

- Add projects in /admin and set **Project type**. `client` or `spec` turns on
  CreativeWork / VideoObject schema; unset never claims the work.
- Spec projects need a **Footage source** (royalty-free or licensed only).
- Add your own showreel in /admin/about; until then that section is hidden.
- Upload videos under new file names. Names in `retired.ts` are refused.
- For MP4 / WebM, run `node scripts/make-video-assets.mjs` to make the
  `-720` and `-preview` copies and upload them next to the master.

## 4. What changed

**Phase 1, design system:** tokens for colour, fluid type, space, radius,
shadow, layers and motion in `globals.css`. Components: Button, Badge, Card,
Container, Section, SectionHeader, Eyebrow. Fonts are subsets: 284 KB down to
99 KB, with licences in `src/app/fonts`.

**Withdrawn content:** the 8 projects and the showreel came out of the seed,
pages, schema, sitemap and scripts. Old URLs answer 410. Rows still in a
database are hidden by `retired.ts`.

**Phase 2, global UI:** header that hides on scroll down and blurs once
scrolled, animated nav underline, full-screen mobile menu (focus trap, scroll
lock, Escape, inert page behind), four-column footer, closing CTA band,
back-to-top, scroll reveal, page fade, card hover (zoom, overlay, play icon,
desktop preview), Play/View cursor. All of it respects reduced motion.

**Phase 3, homepage:** word-by-word hero, availability pill, two CTAs, scroll
cue, stats and logo marquee, showreel band with lightbox, mixed 16:9 / 9:16
editorial grid with separate badges, service cards, process timeline,
testimonials, about teaser, FAQ accordion.

**Phase 4, inner pages:**
- **/work:** counted filters synced to the URL, animated, masonry, a skeleton on shared filtered links.
- **Project page:** player, meta row, Brief / Approach / Result, stills lightbox, previous / next, breadcrumbs.
- **/services:** inclusions, deliverables, turnaround, price and a CTA per service, plus a comparison table that stacks on phones.
- **/about:** story, editors, values, tools.
- **/contact:** date deadline and reference link, validation in the browser and on the server, honeypot, response time.
- **Other:** branded 404 and error pages, WhatsApp button on phones.

**Phase 5, accessibility:** axe-core clean on every page at 390 and 1440px.
44px touch targets, input borders at 3:1, one h1 per page, landmarks, labelled
video controls, captions support (`.vtt`), skip link.

**Phase 6, SEO:**
- **Pages:** titles of 50–60 characters and descriptions of 140–160, built around Pune; canonical URLs (filtered /work points to /work).
- **Share images:** OG and Twitter cards, with images generated per page at `/og/<page>`.
- **Structured data:** Organization + ProfessionalService + WebSite, Person, Service, BreadcrumbList, FAQPage and per-project CreativeWork / VideoObject.
- **Files:** sitemap, robots, manifest and icons.

**Phase 7, performance:**
- **Images:** next/image in AVIF/WebP with blur placeholders, capped at 1920px wide, and accurate `sizes`.
- **Code:** player, lightboxes and gallery load on demand; error pages are dependency-free.
- **Video:** `preload="none"`, and the ambient reel waits until the page has loaded and the reel is in view.

## 5. Measured (Lighthouse 12.8, mobile, median, same machine, before → after)

| Page | HTTP/2 + brotli (like Vercel) | HTTP/1.1 (`next start`) |
|---|---|---|
| / | 94 → 99 | 88 → 93 |
| /work | 94 → 99 | 88 → 94 |
| project page | 94 → 99 | 89 → 95 |
| /contact | 94 → 99 | 87 → 94 |

Accessibility, Best Practices and SEO are 100 on all four after the
redesign. CLS is 0, LCP went from about 3.0 s to 2.2 s, and page weight from
about 500–620 KB to about 300 KB. These figures come from local test
projects. Measure the live site with PageSpeed Insights once your own work
is up.

## 6. Left out, and why

- **Dark mode:** `ink` is both text and dark backgrounds; it wouldn't invert cleanly.
- **A serif face:** the site has none (Archivo + italic accents); kept as it is.
- **Official software logos:** they are trademarks with usage rules, so tool tiles use typographic marks.
- **Slug renames and 301s:** no live project slugs remain to rename.
- **`tailwind-merge`** is unused but still installed (dependency changes need your OK).
- **FAQ rich results:** FAQPage is valid markup, but Google shows FAQ rich results for very few sites now.
- **Not tested:** Safari, Firefox, real phones, production Postgres.
