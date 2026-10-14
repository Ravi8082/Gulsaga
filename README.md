# Gulsaga

React company website with a separately deployable JavaScript Express API, MySQL 8, Prisma, authenticated SMTP, private file storage and ExcelJS exports.

## Important platform distinction

All application page bodies and Express business logic are JavaScript/JSX. The hosted frontend preserves mandatory TanStack Start/Router and its TypeScript route/bootstrap files; it is **not a pure-JavaScript React Router application**. Express must run on a separate Node.js host, not the hosted frontend runtime. No replacement database service is used. If React Router with zero TypeScript is an absolute delivery condition, this source does not satisfy that condition.

## Status and prerequisites

Public navigation, project filtering, unavailable-service messaging and signed-out administration have been checked in the preview. Automated security and genuine XLSX tests run without MySQL. Real migrations, administrator sign-in, email delivery, submissions, uploads, management and database-backed exports remain **unverified** until an isolated MySQL 8 instance and authenticated SMTP service are configured. Do not accept personal data or describe this as production-ready before completing `ACCEPTANCE.md`.

## Local setup

Requires Node.js 22+, Bun, MySQL 8 and an authenticated SMTP account. Use a separate disposable database for tests.

1. Install frontend dependencies: `bun install --frozen-lockfile`.
2. Copy root `.env.example` to `.env`. Set `VITE_API_BASE_URL=http://localhost:4000/api`.
3. In `backend/`, run `bun install --frozen-lockfile` and copy `.env.example` to `.env`.
4. Create the MySQL database with `utf8mb4` and configure `DATABASE_URL`; URL-encode username/password characters. Use a dedicated database user. Use a migration identity for schema changes and a least-privileged runtime identity for ordinary access.
5. Generate **two distinct** secrets with `node --input-type=module -e "import {randomBytes} from 'node:crypto'; console.log(randomBytes(48).toString('hex'))"`. Replace both secret placeholders; never commit `.env`.
6. Configure SMTP credentials, a provider-verified sender and notification recipients. For Gmail, use a Gmail App Password (with 2-Step Verification enabled), not the account login password. A desired Gmail sender cannot be used without valid authenticated provider authorization.
7. In `backend/`, run `bun run generate`, `bun run migrate`, then `bun run seed`. Seed adds only supplied projects and proposed services; it invents no vacancies or administrators.
8. Temporarily add `BOOTSTRAP_EMAIL`, `BOOTSTRAP_PASSWORD` (12+ characters, upper/lowercase, number and symbol) and optional `BOOTSTRAP_NAME` to backend `.env`. Run `bun run bootstrap`, then remove these values. Bootstrap refuses when any administrator already exists.
9. Start API with `bun run dev` and, in another backend terminal, notification worker with `bun run worker`.
10. From repository root start frontend with `bun run dev -- --port 8080`. Visit `/login` to sign in. Never expose the private-storage folder through a web server.

## Deployment

- Frontend: publish through the supported platform deployment. Set the public `VITE_API_BASE_URL` before building. It is an API address, not a secret.
- API and outbox worker: deploy `backend/` to a real Node.js 22 host/container. Install production dependencies, generate Prisma client and apply committed migrations as a controlled release step. Start `node src/server.js` and `node src/worker.js` as separate supervised processes, with backend environment values injected by the host. Production start does not require a checked-in `.env`.
- Use HTTPS for frontend/API and `NODE_ENV=production`. Set `FRONTEND_URL`, exact comma-separated `CORS_ALLOWED_ORIGINS` and `API_PUBLIC_URL` to actual deployment URLs. Set `TRUST_PROXY` only to the known reverse-proxy hop count; never blindly trust all proxies.
- Prefer frontend and API on the same site (e.g. `www.example.com` and `api.example.com`) with `COOKIE_SAME_SITE=lax`. Unrelated domains need `none` plus HTTPS, and browsers may still block third-party cookies; a same-site proxy/domain is recommended. Sessions are HttpOnly, database-backed, 30-minute expiry; mutations require a session CSRF token.
- Use a persistent private volume for local files. For multiple API instances use a private S3-compatible bucket with restricted service credentials and `STORAGE_TYPE=s3`; configure its bucket, region, endpoint and access secrets. Do not enable public bucket access. Only deliberately published website images have public endpoints. Resumes/photos require administrator application permission.
- SMTP acceptance is not inbox delivery. `SENT` means accepted by SMTP; delivery/bounce tracking is not implemented. Outbox retries are at-least-once and may duplicate mail after a crash. Monitor failed messages and retry through the authorized administration screen.
- Run worker continuously for notifications and expiry cleanup. Back up MySQL and private files; test restoration. Supply and approve official contact information, social links, vacancies, policy retention/deletion terms and copy before enabling submissions.

## Tests

```sh
bunx vitest run src/test/app-routing.test.tsx
# from backend/
bun run test
# with backend .env pointing to an ISOLATED test database:
RUN_DB_TESTS=1 node --env-file=.env --test test/integration.test.js
```

The database test checks rejection boundaries, not complete successful workflows. Skipped tests are not successful verification. See `ACCEPTANCE.md` for the required genuine end-to-end checklist.

## Security and implementation notes

OTP codes are cryptographically generated and never stored in plaintext; only keyed hashes are stored for five minutes and limited to five verification attempts. Contact/application records are created only after an email-bound, single-use verification grant is consumed in the same transaction. Resends are rate-limited. Normalize timezones/NTP on database and API hosts. Administrators cannot publicly register. Super-admin-only management is enforced server-side; ordinary admins require explicit resource permissions. Exports additionally require export permission and source-record permission, whitelist columns and escape formula-like text. Files are size/signature/extension-validated; images are decoded/re-encoded with dimension limits. PDF active-content checks are conservative and **not a malware scanner**; production should add quarantine/antivirus scanning before recruitment downloads.

Frontend administration uses server validation as authority; it does not contain private credentials. Administrators with the `content` permission can maintain Services, Founder profiles (`/admin/team`) and Blogs (`/admin/blogs`); published profiles appear on About and published articles appear on `/blogs`. The super-admin Site settings page edits the About company story, mission, vision and services text and uploads its image; founder profiles remain on that same public About page. Founder and blog cover images are published website media, while recruitment files remain private. Schema migrations include the session-store table. Never use Prisma `db push` instead of reviewing/applying migrations in production.
