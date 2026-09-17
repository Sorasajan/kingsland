# Kingsland Abroad — Backend Setup

This project's backend is Next.js API routes + **Prisma ORM v7 + PostgreSQL**.
All site content (company info, destinations, services, testimonials,
FAQs, team, blog) lives in Postgres and is managed from `/admin`. There
is no static JSON data file anymore — `prisma/seed-data/*.json` is a
**one-time seed source only**, not something the app reads at runtime.

Prisma v7 has no bundled native/Rust engine — it always runs on a
TypeScript/WASM query engine plus an explicit driver adapter
(`@prisma/adapter-pg` here). Configuration lives in `prisma.config.ts`
(connection string, schema/migrations paths) rather than inside
`schema.prisma`.

## 1. Prerequisites

- Node.js 20+
- A PostgreSQL database (local install, Docker, or a hosted service like
  Neon/Supabase/Railway)

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — your Postgres connection string (read by `prisma.config.ts`)
- `JWT_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `ADMIN_EMAIL` / `ADMIN_NAME` / `ADMIN_PASSWORD` — used once by the seed
  script to create your admin login (leave `ADMIN_PASSWORD` blank to
  have one generated and printed for you)
- `SMTP_*` — optional; if left blank, contact-form/newsletter signups
  still save to the database, they just won't trigger an email

## 3. Install, generate, migrate, seed

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed:admin
```

`seed:admin` does two things: creates your admin login, and — the first
time only — imports `prisma/seed-data/*.json` into Postgres (company,
site-config, destinations, services, testimonials, FAQs, team). Run it
again any time to reset the admin password; it won't duplicate content
that's already in the database.

> **`Cannot find module '../lib/generated/prisma'`?** You ran
> `npm run seed:admin` (or `npm run dev` / `npm run build`) before
> `npx prisma generate`. That command is what generates
> `lib/generated/prisma` in the first place — run the four commands
> above in order and this goes away. The seed script now also prints
> the same command list as a friendly hint if you hit this.

## 4. Run it

```bash
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Roles & permissions

Every admin API route and every `/admin` page is permission-gated by
`middleware.ts`, using the resource/role map in `lib/permissions.ts` —
not just "logged in or not." A request's path maps to a resource
(`leads`, `blog`, `users`, ...) and its HTTP method maps to an action
(`read` for GET, `delete` for DELETE, `write` for POST/PUT/PATCH); the
session's role must grant that `resource:action` pair or the request
gets a 403 (API) / redirect (page).

| Role | Can access |
|---|---|
| **Super Admin** | Everything, including managing other admin users (`/admin/users`) and Company Settings |
| **Admin** | Leads, newsletter, testimonials, destinations, services, blog, team, Company Settings — no user management |
| **Editor** | Testimonials, destinations, services, blog, team only — no Company Settings, leads, or user management |
| **Support** | Leads (read/write, no delete) and newsletter (read-only) only |

The bootstrap account created by `npm run seed:admin` is always
**Super Admin**. Create additional admins with narrower roles from
`/admin/users` (Super Admin only). The public site's own APIs
(`/api/contact`, `/api/newsletter`, `/api/blog*`, `/api/auth/login`) are
intentionally **not** behind this gate — they're what visitors and the
login form use, and have their own validation/rate-limiting instead.

## What's in the backend

**Public API**
- `POST /api/contact` — consultation form → saves a `Lead`, emails you if SMTP is configured
- `POST /api/newsletter` — footer signup → saves a `NewsletterSubscriber`
- `GET /api/blog`, `GET /api/blog/[slug]` — published posts only
- `POST /api/testimonials` — "Share Your Story" form on the Success Stories page. Saves with `approved: false` — never shown on the site until approved from `/admin/testimonials`. Rate-limited to 3/hour per IP.
- `POST /api/upload` — image upload used only by the story form's photo field (unauthenticated, so it's rate-limited to 5/hour per IP — don't reuse this for other public forms without reviewing that limit)
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` — admin password reset flow

**Admin API** (require a logged-in session AND the right role/permission — see above)
- `/api/admin/leads` — list, update status, delete
- `/api/admin/newsletter` — list, delete
- `/api/admin/newsletter/send` — compose and send a one-off email to every subscriber
- `/api/admin/testimonials` — list, create, update, delete
- `/api/admin/destinations` — list, create, update, delete
- `/api/admin/services` — list, create, update, delete
- `/api/admin/blog` — list, create, update, delete, publish/unpublish
- `/api/admin/team` — list, create, update, delete
- `/api/admin/gallery` — list, create, update, delete ("Inside Our World" section on the homepage & About page)
- `/api/admin/settings` — read/update company info (name, logo, contact, address, office hours, social links, headline stats, registration, certifications, awards)
- `/api/admin/pages/[key]` — read/update page hero text (About, Test Prep) and legal page content (Privacy Policy, Terms of Service). `key` is restricted to a fixed whitelist.
- `/api/admin/popup` — read/update the homepage announcement popup
- `/api/admin/users` — list, create, update role/password, delete (Super Admin only)
- `/api/admin/smtp` — read/update SMTP settings (password never returned, only whether one is set)
- `/api/admin/smtp/test` — send a test email using saved or in-progress settings
- `/api/admin/upload` — accepts a multipart image file, saves it to `/public/uploads`, returns its public URL (used by the photo-upload fields in the admin forms — see note below)

**Admin dashboard** (`/admin`) — overview stats, and a page per resource
above with create/edit/delete UI. The sidebar only shows links the
current user's role has read access to. All forms use real structured
input fields — including repeatable add/remove rows (via the shared
`RepeaterEditor` component) for array-of-object data like destination
scholarships, service scholarship types, test-prep test details, and
company certifications/awards. There's no raw JSON editing anywhere in
the admin UI.

**Local image uploads:** Team, Testimonials, Blog, and Company Settings
(logo) all have a photo upload field (drag in a file, or paste a URL
instead). Uploaded files are saved to `/public/uploads` on disk. This
works great for `npm run dev` and traditional Node hosting. **It will
NOT persist on serverless platforms like Vercel** — their filesystem is
read-only/ephemeral outside `/tmp`, so uploaded images would vanish
after a redeploy. If you deploy there, swap
`app/api/admin/upload/route.ts` for an object-storage upload (S3,
Cloudinary, Vercel Blob, etc) instead.

**Legal pages ship with placeholder text.** `/privacy-policy` and
`/terms-of-service` are real pages, but the seeded content is a
placeholder telling you to replace it — not actual legal copy. Edit
both from `/admin/pages` before launching, ideally after a lawyer
reviews them. The footer also links to `/refund-policy`, which doesn't
have a page yet; either build one the same way (add a `legal-refund-policy`
key to the whitelist in `app/api/admin/pages/[key]/route.ts`) or remove
that link from `site-config`'s `navigation.footer.legal`.

**Landing popup** (`/admin/popup`) is disabled by default. "Once per
browser session" uses `sessionStorage` (reappears in a new tab); "Once
per day" uses a `localStorage` timestamp; "Every page load" ignores
both and always shows after the delay. It only renders on the homepage.

**Public testimonial submissions.** Anyone can submit a story from the
Success Stories page. It's saved immediately but stays completely
invisible on the site — `getTestimonials()` only ever returns rows with
`approved: true` — until you approve it from `/admin/testimonials`
(filter dropdown → "Pending review"). Testimonials you add directly as
an admin are auto-approved. The submitter's email is stored for your
own follow-up but is never exposed through any public endpoint.

**Rich text editor** (blog posts, Privacy Policy, Terms of Service,
popup message) supports inline images with text-wrap: select an image
you've inserted and the toolbar shows wrap-left / no-wrap / wrap-right
buttons. Content is sanitized server-side to an allowlist that includes
`<img>` with only the specific inline styles the wrap buttons can
produce — arbitrary CSS/HTML injected outside the editor gets stripped.

**Empty sections auto-hide.** Every section built from admin-managed
data (Destinations, Services, Test Prep, Success Stories, FAQs,
Gallery, and the Team block on the About page) returns nothing at all
— not even its heading — when there's no data to show, rather than
displaying an empty-looking section. Delete everything from a resource
and its section on the site quietly disappears.

**Gallery** (`/admin/gallery`) — admins only pick photos and their
order; the site decides layout automatically (a repeating
normal/wide/tall pattern) so you don't have to think about grid sizing.
Homepage and About page show a 6-photo preview with a "View Full
Gallery" link once there are more than 6; `/gallery` shows everything.
Clicking any photo anywhere opens a full-screen lightbox with
prev/next arrows and Escape-to-close.

**SEO** (`/admin/seo`) covers what's realistic to manage from an admin
panel:
- `app/sitemap.ts` / `app/robots.ts` — auto-generated at `/sitemap.xml`
  and `/robots.txt`, including every destination and published blog post
- Site-wide default meta title/description, Open Graph image, and
  Twitter handle (individual pages like blog posts and destinations
  already set their own, more specific metadata — the SEO settings are
  the fallback)
- Google Analytics (GA4) — paste a Measurement ID and the tracking
  script injects site-wide; leave blank to not load it at all
- Google Search Console / Bing Webmaster verification meta tags
- `EducationalOrganization` JSON-LD on every page (built from your
  Company Settings) and `Article` JSON-LD on every blog post

Set **Site URL** in `/admin/seo` before going live — it's what the
sitemap, canonical links, and Open Graph URLs are built from. Without
it, everything falls back to `NEXT_PUBLIC_SITE_URL` (set in
`.env.local`) or a placeholder domain.

**Email / SMTP settings** (`/admin/smtp`, Admin/Super Admin only) — SMTP
can now be fully configured from the dashboard instead of only
`.env.local`. The password is encrypted (AES-256-GCM, see
`ENCRYPTION_KEY` in `.env.example`) before it's stored — the admin API
never returns the actual password back to the browser, only whether one
is currently saved. A "Send Test Email" button lets you verify settings
work before relying on them. Environment variables still work as a
fallback for any field left blank in the DB, so nothing breaks if you
never touch this page.

**Forgot password** (`/admin/forgot-password` → emails a link →
`/admin/reset-password`). Requires SMTP to be configured (env vars or
`/admin/smtp`) to actually deliver the email — if it isn't, the request
still "succeeds" from the user's perspective (same generic message
either way, to prevent account enumeration) but nothing gets sent; check
your server logs. Reset links expire after 1 hour and are single-use.
Only the SHA-256 hash of the reset token is stored — the raw token only
ever exists in the emailed link, so a database leak alone can't be used
to reset anyone's password.

**Newsletter broadcasts** (`/admin/newsletter` → "Compose & Send",
requires `newsletter:write` — Support role can view subscribers but not
send). Sends one individual email per subscriber, in small concurrent
batches, rather than a single BCC blast — so nobody sees anyone else's
address. Requires SMTP to be configured; the button is disabled with an
explanation if it isn't. Every email includes a one-click unsubscribe
link (`/api/newsletter/unsubscribe?id=...`) that removes that
subscriber and redirects to a confirmation page — no login required,
since email clients can't submit authenticated requests. There's a
mandatory review-before-send confirmation step showing the recipient
count and a preview, since sending is irreversible.

**Per-post blog SEO** (`/admin/blog` → edit any post → SEO panel):
- **URL slug** is now editable (it used to be auto-generated only, with
  no way to change it). Auto-fills from the title while creating a new
  post; once you or an existing post has a slug, it's never silently
  overwritten. Editing on a *published* post's slug breaks old links
  and search rankings for the previous URL — the UI warns about this.
  Colliding slugs are auto-deduped (`-2`, `-3`, ...) rather than
  erroring, same as on create.
- **Tags** use a proper chip input with autocomplete suggested from
  every tag already used across your posts, so wording stays
  consistent instead of drifting (e.g. "IELTS" vs "ielts" vs "Ielts").
  Tags also feed the post's `keywords` meta tag and its `Article`
  JSON-LD `keywords` field.
- A live **Google search-result preview** (URL / title / description)
  updates as you type, so you can see roughly how the post will look
  before publishing.

> **Not yet built:** the admin dashboard has no UI screen for editing
> FAQs or the broader SiteConfig (nav links, partner university list,
> etc) — those are seeded once from `prisma/seed-data/` and currently
> need a direct edit in Prisma Studio (`npm run db:studio`) or a new
> `/admin/faqs` page if you want a UI for them later.

## Data model notes

- `Lead`, `NewsletterSubscriber`, `BlogPost`, `AdminUser` are fully
  relational Prisma models.
- `Destination`, `Service`, `Testimonial`, `FAQ`, `TeamMember` keep
  their original rich, presentation-heavy shape (many optional fields).
  Each row has real `id`/`slug` columns for lookups plus a `data` JSONB
  column holding the full record — no separate migration needed every
  time a new display field is added to one of these.
- `Company` and `SiteConfig` (nav links, stats, certifications, etc.)
  are single-row JSON blobs in the `SiteContent` table, keyed by
  `"company"` / `"site-config"`.

## Why `jose`, not `jsonwebtoken`

Session tokens are signed/verified with the `jose` library
(`lib/auth.ts`), not `jsonwebtoken`. This matters: `middleware.ts` runs
in Next.js's **Edge runtime**, which doesn't fully support Node's
`crypto` module. `jsonwebtoken` depends on it directly, so
`jwt.verify()` can silently throw on every single request inside
middleware — the cookie looks correctly set in DevTools, login returns
200, but you get redirected straight back to `/admin/login` every time
regardless of restarts. `jose` is built on the Web Crypto API and works
identically in both the Node runtime (API routes) and Edge runtime
(middleware), so this doesn't happen. If you ever add another JWT
library to this project, make sure it's Edge-compatible for the same
reason.

## Useful scripts

```bash
npm run db:studio     # Prisma Studio — browse/edit data in a GUI
npm run db:migrate     # create a new migration after editing schema.prisma
npm run seed:admin     # (re)create admin login / seed content
```
