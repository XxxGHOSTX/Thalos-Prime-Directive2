# Thalos Prime Directive 2

**Project status: development-stage software; security remediation is in review.**

This repository contains a Node.js/Express service, health endpoints, example API routes, metrics, and deployment templates. It is one component in the wider Thalos Prime project; it should not be treated as proof that the wider Thalos Prime system is complete or production-ready.

## Security posture

The current proposed remediation is on branch `security/use-safe-example-cors-origins` and is available for review in [PR #13](https://github.com/XxxGHOSTX/Thalos-Prime-Directive2/pull/13).

The proposed branch adds:
- explicit CORS-origin validation with no wildcard;
- bearer-token authentication for API endpoints and metrics;
- fail-closed behavior if the token is missing or shorter than 32 bytes;
- 1 MiB request body limits;
- host-loopback-only port publication in the provided Docker Compose file;
- regression tests and updates to historical readiness claims.

These changes are **not merged or deployed**. Do not expose the service publicly before completing review, CI, secret configuration, TLS/reverse-proxy configuration, deployment validation, and dependency security review.

## Local development

Use Node.js 18 or newer and npm 9 or newer.

1. Install dependencies with `npm ci`.
2. Configure `ALLOWED_ORIGINS` with exact local browser origins.
3. Generate a unique high-entropy `THALOS_API_TOKEN` of at least 32 bytes using a secure local method; do not commit it.
4. Start with `npm start`.
5. Send the token in the header `Authorization: Bearer <token>` when calling `/api/*` or `/metrics`. Health endpoints and the root landing page remain public.

The default Compose file maps service ports to host loopback only. This is a local development posture, not a production deployment guide.

## Validation

Run `npm test -- --runInBand`, `npm run lint`, and `npm run format:check`. Container build and dependency/security scans must also pass before declaring a release ready.

See [SECURITY.md](SECURITY.md) for responsible disclosure and current caveats. The former readiness checklist has been retained under docs/archive for historical reference, not as a present-day certification.
