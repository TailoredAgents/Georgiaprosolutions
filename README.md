# Georgia Pro Solutions LLC

A complete Next.js property-services website and private business dashboard, built directly in this project folder for the Tailored Agents sales preview.

## Open locally

```powershell
npm ci
npm run dev -- --port 43187
```

Open **http://localhost:43187**. The five public pages are `/`, `/services`, `/our-work`, `/about`, and `/contact`. Privacy information is at `/privacy`. The private administrator area is `/admin`, with sign-in at `/admin/login`.

The safe default is **preview mode**: estimate requests are validated and discarded, notifications are never sent, event collection is disabled, and indexing is blocked through metadata, response headers, robots.txt, and an empty sitemap. A discreet footer identifies the proposal. All photography is licensed illustrative stock, never presented as completed customer work.

Use `.env.example` as the configuration reference. If no `.env.local` exists, copy the example to `.env.local` and set `SITE_URL` to the exact local URL, including the port. Other applications may already occupy port 3000 on this computer.

## Set up administrator access

```powershell
npm run admin:setup
```

Enter the administrator email when prompted. The command generates a strong random password, prints it once, and saves only the salted scrypt hash plus a random session secret to ignored `.env.local`. Save the password in a password manager, restart the server, and sign in at `/admin/login`. Re-run the command to rotate credentials and invalidate prior sessions. No public registration or default password exists.

Administrator access is intentionally unconfigured in the delivered local preview. **Run this command to create your own access.** QA credentials are generated separately and are never a production account.

The generated hash uses colon separators so it can be copied directly into Render private environment variables without dotenv interpolation. Never upload `.env.local` to a repository. The verifier also accepts earlier dollar-delimited hashes; those separators must be escaped in a Next.js dotenv file.

## What is included

- Five fully designed public pages, custom geometric wordmark/favicon, local Manrope and Sora fonts, responsive local images, service deep links, FAQ disclosures, mobile navigation, and estimate actions.
- Filterable inspiration gallery with full-size image viewer, next/previous controls, Escape/arrow keys, focus return, and a reusable authentic before/after component for future paired project images.
- Validated contact form, honeypot, timing check, bounded JSON bodies, same-origin enforcement, and rate limiting. Optional photo uploads were deliberately omitted to avoid an unnecessary file-storage service.
- Private dashboard with 7/30/90-day ranges, visits, pageviews, estimated visitors, quote requests, inquiry-to-visit ratio, popular pages, source/device charts, inquiry history, search, status changes, and CSV export.
- A clearly labeled sample workspace generated entirely in memory. Fictional leads use reserved example domains and fictional phone numbers. Sample changes stay in the browser; sample records are never inserted into PostgreSQL.
- Production PostgreSQL persistence, transactional inquiry/event writes, optional Resend notifications, server-side authentication and authorization, durable rate limits, and expiring/revocable sessions.
- Owner-approval gate for LocalBusiness schema; per-page metadata/canonicals; robots and sitemap controls; security headers; error and not-found experiences.

## Build and check

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run start -- --port 43187
```

See [the QA report](docs/QA.md) for the final results and visual inspection coverage. Full browser tests run against two separately compiled production builds and an isolated PostgreSQL test container. Instructions are in that report.

## Production and hosting

Follow [Render deployment instructions](docs/DEPLOYMENT.md). `render.yaml` prepares a database-free preview web service. `render.production.yaml` adds managed PostgreSQL and a daily retention job. These are deployment definitions; **this project has not been deployed to Render**. No Render account or connected deployment capability was available in this session.

Before customer activation, complete [owner confirmation](docs/OWNER-CONFIRMATION.md). Research limitations and the supplied-versus-verified fact record are in [business research](docs/RESEARCH.md). Image origins and licenses are in [image sources](docs/IMAGE-SOURCES.md).

## Project map

| Location                        | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `src/lib/business.ts`           | Central business details, services, gallery/project data |
| `src/app/(site)`                | Public server-rendered pages                             |
| `src/components`                | Brand, navigation, forms, galleries, dashboard           |
| `src/app/api`                   | Validated server endpoints and authorization             |
| `src/lib/auth.ts`, `crypto.mjs` | Scrypt hashing and server-side session handling          |
| `src/lib/db.ts`, `dashboard.ts` | Pooled PostgreSQL and real/sample metrics                |
| `migrations/`                   | Versioned, checksummed SQL migrations                    |
| `scripts/`                      | Admin setup, migration, retention, isolated QA tooling   |
| `public/images/`                | Local licensed illustrative stock photography            |

One cohesive application; no chatbots, SEO agents, phone receptionists, CRM integration, or automated follow-up services were added.
