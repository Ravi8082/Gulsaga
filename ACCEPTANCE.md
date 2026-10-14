# Real-service acceptance gate

Status: **not run** — no configured real MySQL 8/SMTP backend is available in this workspace.

Run against an isolated deployment, with actual SMTP inboxes you control. Do not fake API responses or write OTP grants directly to the database. Record date, commit, deployment, test account role, persisted reference IDs and pass/fail evidence; redact credentials, OTPs and personal information.

- [ ] Apply initial migration on clean MySQL 8, generate Prisma client, seed and restart API/worker; `/api/health` succeeds. Check all tables/indexes/foreign keys, including sessions. Check migration drift.
- [ ] Bootstrap initial super-admin, confirm login and session read-back through UI, logout, expiry, disabled-account/session-version revocation, invalid-login rate limiting and password reset through real email.
- [ ] Receive a real contact OTP; confirm wrong/expired/reused/email-swapped/purpose-swapped codes are rejected and resend limits work. Submit verified enquiry and read its exact reference/details back in the admin UI and MySQL.
- [ ] Receive both enquiry notification emails. Record SMTP acceptance separately from inbox delivery. Stop SMTP, submit and confirm durable outbox, retry backoff, failed-message state, manual retry and recovery after restart.
- [ ] Create a genuine approved vacancy (job and internship), publish, filter/search and open it publicly. Change/close/archive it; expired/closed jobs must reject submissions, including after a form was opened.
- [ ] Apply using a real received email code and valid PDF; include a required photo. Read application, qualification, consent and reference back through admin UI and MySQL. Confirm files remain available after deployment restart.
- [ ] Reject oversized, wrong-extension, wrong-MIME/signature, animated, oversized-dimension and active-content PDF files; failed/invalid submission must not consume its grant or leave orphaned saved files.
- [ ] Confirm public requests cannot retrieve resumes/photos. Create limited ADMIN accounts; directly call forbidden API endpoints, including admin promotion, settings, audit, uploads, resumes and export. Confirm super-admin-only resources cannot be granted through ordinary permission rows.
- [ ] Review applications, update statuses/notes, read status history, download authorized files and receive shortlisted/interview/rejected notifications. Confirm application history and audit logs persist.
- [ ] Create/edit/archive projects and services, including Exhore without a destination; upload/publish website imagery; update settings and confirm the actual public website reflects changes.
- [ ] Export each resource from actual saved records, with status/date/job/search filters. Open XLSX in Excel/LibreOffice, compare row counts/columns against MySQL, test Unicode and formula-injection strings, and verify forbidden columns are absent and audit records exist.
- [ ] Check desktop/mobile navigation, forms, keyboard access, dialogs, text fitting, images, refresh/deep links and no runtime errors during authenticated flows.
- [ ] Validate production HTTPS, cookie behavior, exact CORS, CSRF rejection, proxy configuration, backup restore, retention/deletion procedure, private storage and malware scanning controls.

Only declare full application completion after every required gate has genuine evidence. The automated integration suite currently covers rejection checks, not this whole checklist.