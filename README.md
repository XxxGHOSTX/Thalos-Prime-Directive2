# Thalos Prime Directive 2

**Development-stage application. Production readiness is not established.**

This repository contains an application framework, source code, tests, Docker/Kubernetes templates, and operational documentation. Deployment templates require environment-specific configuration and security review before external exposure.

## Current security posture

The security review branch `security/secure-api-and-safe-config-2026-10-31` proposes bearer authentication for API and metrics routes, strict CORS, fail-closed behavior for missing credentials, loopback-oriented local development, and hardened Kubernetes defaults. It is not merged or deployed.

Do not treat badges, old checklists, historic test counts, or prior "production-ready" wording as evidence of a current production deployment. See [PRODUCTION_READY.md](PRODUCTION_READY.md) for the verified status and [docs/SECURITY_OPERATIONS.md](docs/SECURITY_OPERATIONS.md) for required controls.

## Features

- Express-based API service
- Health and readiness endpoints
- Optional Prometheus metrics, protected by bearer authentication in the reviewed branch
- Docker and Kubernetes deployment templates
- Jest tests, linting, dependency and filesystem security scans in CI

## Requirements

- Node.js 24 LTS or later
- npm 10 or later
- Docker Engine and Docker Compose for local container development
- A Kubernetes cluster only after all deployment placeholders and security requirements are satisfied

## Local development

1. Clone the repository and enter its directory.
2. Copy `.env.example` to `.env`.
3. For local UI/API work, explicitly set `APP_ENV=development` and, only on a trusted local machine, `THALOS_AUTH_DISABLED=1`. The bypass is rejected in production or when the environment is unknown.
4. Run `npm ci`, then `npm test` and `npm run lint`.
5. Run `npm start` or use `docker compose up --build`.

The development bypass is not for staging, shared test systems, CI deployments, or public endpoints. Do not use a real production token in local development.

## API authentication

The reviewed application requires a random, independent `THALOS_API_TOKEN` with at least 32 UTF-8 bytes for every `/api/*` route and `/metrics`. Clients send it as:

```http
Authorization: Bearer <THALOS_API_TOKEN>
```

Do not store this shared backend token in browser JavaScript, HTML, localStorage, sessionStorage, query strings, or source maps. The static browser UI does not yet implement production user-login/session authentication. Before exposing it in production, implement OIDC-backed sessions or a trusted identity-aware gateway that authenticates users and injects the backend token server-side. Restrict privileged routes to administrators.

Public health endpoints expose minimal status only. The browser cannot stop the server process; use trusted host or orchestration controls.

## Configuration and monitoring

- Production requires `APP_ENV=production` and exact approved HTTPS origins in `ALLOWED_ORIGINS`.
- Never set `THALOS_AUTH_DISABLED=1` outside explicitly declared local development/test.
- Store credentials in a secret manager or protected runtime secret injection. The checked-in Kubernetes Secret is a non-deployable template.
- The `/metrics` endpoint is authenticated. Keep it on a private network and configure the metrics scraper to authenticate.
- Use TLS, request limits, rate limits, resource limits, network restrictions, secure logs, and tested encrypted backups.

## Docker and Kubernetes

The Dockerfile uses Node.js 24. Compose publishes ports only on host loopback by default. The Kubernetes deployment image field intentionally contains a placeholder; replace it with a verified immutable image digest from your registry before deployment. Replace the example hostname/origin and create the Kubernetes Secret through a secret manager. Do not apply the checked-in Secret template as a real credential.

Do not run `kubectl apply -f k8s/` as a production deployment until the image digest, actual secrets, ingress hostname, TLS certificate, CORS origins, monitoring authentication, network controls, and cluster policy have been reviewed.

## Testing

```bash
npm ci
npm test
npm run lint
npm run format:check
docker build -t thalos-prime:local .
```

Run the same checks in CI against the exact release commit and retain the resulting evidence. Do not merge a security update while any required check is failed or undiagnosed.

## License

This repository contains an Apache-2.0 license. Review the actual license and third-party notices before redistribution.
