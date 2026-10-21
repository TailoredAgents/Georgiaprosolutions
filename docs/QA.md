# Validation and visual review

Completed in the October 21, 2026 project session against Next.js 16.4.2 and Node 22.19.0 on Windows. The local public site was opened and visually inspected in the in-app browser. Additional production-build browser checks and screenshots used Playwright/Chromium.

## Successful final checks

| Check                                 | Result                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `npm run build`                       | Passed; all public pages and API/admin routes compiled                            |
| Preview and production-mode QA builds | Both passed independently                                                         |
| `npm run typecheck`                   | Passed                                                                            |
| `npm run lint`                        | Passed with no errors or warnings                                                 |
| `npm test`                            | 3 security-focused tests passed                                                   |
| `npm run test:e2e`                    | All 11 browser/integration tests passed                                           |
| Render Blueprints                     | Both validated against Render's published JSON schema                             |
| `npm audit --omit=dev`                | 0 production vulnerabilities at validation time                                   |
| Secret exclusion                      | `.env.local`, QA credentials, build output, and test artifacts are ignored by Git |

The browser suite checked every public page at **375, 430, 768, and 1440 pixels**, including image decoding, JavaScript errors, and horizontal document overflow. It checked the dashboard at the same widths.

## Behavior exercised

- Main/mobile navigation, service deep links, gallery filtering, image viewer next/previous arrows, Escape to close, and keyboard navigation.
- Native required-field validation, service preselection, successful preview estimate flow, server rejection of invalid submissions, and cross-origin rejection. Preview responses explicitly reported no persistence and no email.
- Real PostgreSQL migration and inquiry/event transactions in a **new, isolated disposable PostgreSQL container**. No existing business database was used.
- Production inquiry save with an unconfigured notification provider returned `stored: true` and `emailSent: false`. Honeypot submissions did not create inquiry rows.
- Anonymous pageview collection, keyed visitor/visit identifiers, source categories, Do Not Track suppression, consent UI, and rejection of `/admin` event paths. Analytics records did not contain raw IPs.
- Protected dashboard/export endpoints, incorrect and correct login, server-side administrator authorization, status changes, real and sample metrics, date-range selection, CSV download and formula-injection escaping.
- Sample-data isolation: viewing illustrative dashboard data did not add production inquiry rows. Preview live mode without a database showed zero values and a setup message.
- HttpOnly, SameSite=Strict session cookies; production-build cookie prefix/security settings; server-side logout invalidation; persistent login throttling.
- Noindex response headers, robots exclusion, and an empty preview sitemap.

## Visual review

Reviewed desktop and phone compositions for the homepage, Services, Our Work, About, Contact, and dashboard using the running browser and saved rendered screenshots. The public site uses balanced service imagery, local fonts, service-specific calls to action, readable phone forms, a responsive gallery, and consistent footer/closing sections. The private dashboard uses a distinct workspace layout with responsive charts and inquiry management.

Corrections included stable server/client production-mode text, server-visible content under reduced-motion settings, mobile dashboard overflow, responsive donut-chart proportions, and allowed image quality settings. Final screenshots were reviewed after those changes. The separate desktop hero screenshot waits for fonts and images to decode before capture.

Screenshots remain locally under `qa/screenshots/`, including `home-desktop.png`, each public page at all four widths, and `admin-375.png` through `admin-1440.png`. These are QA evidence, not production database records.

## Reproduce the full suite

Docker with the official `postgres:16` image and Chromium for Playwright are needed. The scripts create and label a separate disposable database and generate random QA-only credentials in ignored `qa/runtime.json`. They do not replace an existing administrator configuration.

```powershell
npm ci
npx playwright install chromium
node scripts/qa-bootstrap.mjs
node scripts/qa-build.mjs
npm run test:e2e
node scripts/qa-cleanup.mjs
```

If the Postgres image is not already available, pull it from the official Docker registry first. An authenticated registry may be needed on this computer. Ports 43188 and 43189 must be available. Two separately compiled production builds are used so Windows/OneDrive development watchers cannot race over shared manifests. Public development uses port 43187.

## Boundaries and remaining external checks

- Render deployment, actual HTTPS/domain behavior, and configured Resend inbox delivery have not been tested because those services are not connected/configured. Blueprints were schema-validated locally; they have not provisioned resources.
- No actual customer data was collected. Stock images and fictional analytics remain clearly identified.
- The full dependency audit reports a development-only transitive `braces` advisory through the Next ESLint toolchain (five affected development dependency entries). The production dependency audit is clean. No compatible upstream fix was offered by npm at delivery; do not force a downgrade of Next's lint configuration. Recheck when updating the toolchain.
- Owner approval, authentic project imagery, coverage/surface/material confirmation, production credentials/database, notification delivery, and official-domain authorization are required before turning this sales concept into the authorized official site.
