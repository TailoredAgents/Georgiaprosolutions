# Render deployment

## Current status

Prepared and tested locally; **not deployed**. Source repository: [TailoredAgents/Georgiaprosolutions](https://github.com/TailoredAgents/Georgiaprosolutions). The public preview still needs a Render web service. Never send the localhost URL to the prospect as a hosted website.

## Customer preview

1. Use the `main` branch of the source repository above. `.env.local`, test runtime credentials, `node_modules`, build directories, screenshots, and test artifacts are excluded by `.gitignore`.
2. In Render, connect that repository and select the root `render.yaml` Blueprint. This defines one Node web service using `plan: starter`, the $7/month paid instance, and does not provision a database. The agency selects/accepts hosting charges directly in Render. See [Render's published Starter comparison](https://render.com/articles/render-vs-railway) for the current listed instance price; any other resources or usage are billed separately.
3. Set `SITE_URL` to the exact assigned HTTPS origin, such as the service's actual `https://…onrender.com` URL. Do not use an invented URL or a localhost origin. Keep `SITE_MODE=preview`, `ALLOW_INDEXING=false`, and both analytics flags false.
4. Run `npm run admin:setup` locally to generate credentials for the person presenting the private dashboard. Set the email and hash in Render's **private environment variables**. Use the Blueprint-generated session secret or provide at least 32 random characters. Never place a plaintext password in source or a Blueprint.
5. Deploy using build command `npm ci && npm run build`, start command `npm run start -- --port $PORT`, and health path `/api/health`. The Blueprint has automatic deployment off.
6. Verify all five public routes over HTTPS, noindex headers, estimate preview confirmation, `/admin` authorization, dashboard sample label, and logout. Share the assigned verified HTTPS URL only after this check.

Node 22 or newer is required. The Blueprint pins the version available during development; update to a currently patched Node 22 release as part of deployment maintenance. Build/install must include dev dependencies because Tailwind, TypeScript, and lint tooling are build inputs. Do not set `NPM_CONFIG_PRODUCTION=true` during the web-service build.

Render's documented Next.js web-service workflow: [Deploy a Next.js App](https://render.com/docs/deploy-nextjs-app).

## Production activation after owner approval

Use `render.production.yaml` as a separate Blueprint definition, or apply its database and retention configuration to the existing service. The agency should select appropriate current Render plans and backups before provisioning paid resources. The supplied production definition creates a web service, managed PostgreSQL, and a scheduled retention process in the same deployment region.

1. Confirm every item in `OWNER-CONFIRMATION.md`. Update `src/lib/business.ts`, replace the inspiration records with owner-approved project records, and retain photo attribution as required. No actual project history or review has been invented.
2. Create managed PostgreSQL. Set `DATABASE_URL` from its internal connection string. With the Render private network use `DATABASE_SSL=false`. For external database connections use TLS with certificate verification (`DATABASE_SSL=true`), with `DATABASE_CA` only when a trusted custom CA is needed. Do not disable certificate verification.
3. Run `npm run db:migrate`. The production Blueprint runs this in `preDeployCommand`. The migration runner uses a PostgreSQL advisory lock and checksummed migration records, and applies pending files in transactions. Never change an already-applied migration; add a new numbered file.
4. Set `SITE_MODE=production`, approved `SITE_URL`, administrator email/hash, and a strong `SESSION_SECRET`. HTTPS is required: production cookies are Secure, HttpOnly, SameSite=Strict, scoped to `/`, with the `__Host-` prefix. Sessions expire after eight hours. Credential rotation invalidates old sessions.
5. Configure optional Resend email: `RESEND_API_KEY`, `NOTIFICATION_FROM` on a verified domain, and the business-approved `NOTIFICATION_TO`. Until all three exist, the form stores inquiries but does not attempt email. Notifications contain a service category, reference, and dashboard link, not the full customer message or contact information. The dashboard records off/sent/failed provider status. Provider acceptance is not claimed as inbox delivery. Perform a real end-to-end delivery test after configuration.
6. Decide whether to enable optional analytics. Set both `ANALYTICS_ENABLED=true` and build-time `NEXT_PUBLIC_ANALYTICS_ENABLED=true`. Collection waits for consent and respects Do Not Track. Confirm the privacy text with the owner. No external analytics provider is used.
7. Keep `ALLOW_INDEXING=false` until the customer authorizes the official launch. Once details are approved, set `BUSINESS_DETAILS_APPROVED=true` for LocalBusiness schema and `ALLOW_INDEXING=true` for indexing, then rebuild/redeploy.
8. Confirm the configured retention periods. The production Blueprint runs `npm run db:prune` daily at 07:17 UTC. Defaults are 90 days for anonymous events and 365 days for inquiries; the same job clears expired sessions and rate-limit buckets. Configure equivalent daily scheduling if deploying without the supplied cron service. Backups have their own retention and must be set in Render.

**Rebuild after changes to `SITE_MODE`, `SITE_URL`, indexing/schema flags, and `NEXT_PUBLIC_*`.** Public pages and their metadata are pre-rendered and client flags are build-time inputs. Use the same settings during build and runtime.

## Database and traffic behavior

- Inquiries and successful inquiry events are committed together. If persistence fails, the form returns an actionable error instead of a false confirmation. Notification failure never deletes a saved inquiry.
- Live dashboard queries use actual PostgreSQL rows. Disconnected live mode displays zero metrics and a setup message. A temporarily failing database produces a controlled unavailable response. No fallback sample values are represented as live activity.
- Samples are calculated on demand and cannot contaminate production tables. Selecting the sample dashboard does not write sample leads.
- Analytics are best-effort and cannot break navigation or form rendering. Only known public page paths are accepted; admin URLs are rejected. Event records omit IP addresses and inquiry contact/message content. Random browser identifiers are keyed and rotate monthly for estimated visitor counts. Visit identifiers represent browser-tab sessions. Charts use UTC.
- The inquiry-to-visit ratio divides all received inquiries by measured visits. Consent choices and ad blockers can make the measured denominator incomplete. It is not a person-level attribution claim.
- Production rate limits are durable in PostgreSQL. Login uses a shared single-administrator bucket (10 attempts per 15 minutes), so spoofed forwarded IPs cannot bypass the account limit. Other limits share a bucket unless `TRUST_PROXY=true` is deliberately enabled behind a proxy confirmed to overwrite forwarded IP headers.
- Preview sessions and limits live in process memory, suitable for the one-instance preview; a restart signs users out. Production uses PostgreSQL sessions and rate limits.

## Maintenance

Keep environment secrets in Render, use managed database backups, review notifications in the dashboard, run retention daily, and keep Next.js/Node/dependencies patched. At delivery, the production dependency audit was clean; see QA for the development-only advisory. Credentials and full customer request bodies are never logged by application code.
