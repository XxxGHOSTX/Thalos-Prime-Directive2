# Thalos Prime Directive 2 Security Operations

**Status:** Review guidance for the source repository. This document is not a deployment certification.

## Runtime configuration

Use an explicit `APP_ENV`. For production, set it to `production` and configure `ALLOWED_ORIGINS` as an exact comma-separated list of approved HTTPS origins. Wildcards, paths, credentials in URLs, and HTTP origins in production are rejected. Development defaults are localhost-only.

Set `THALOS_API_TOKEN` through the deployment platform's secret manager. It must contain at least 32 UTF-8 bytes. Use an independent randomly generated value. The `/api/*` routes and `/metrics` require `Authorization: Bearer <token>`; public health and root endpoints are intended to expose only basic service/liveness information. Do not put the token in Git, container images, source maps, build logs, issue comments, or example manifests.

CORS is not authentication. Keep bearer authentication, TLS, rate limits, and network restrictions as separate controls.

## Local and container operation

- The checked-in `.env.example` is a development template with loopback binding and localhost CORS.
- The application defaults to loopback binding when launched directly.
- The Docker image sets `APP_HOST=0.0.0.0` inside the container; this is an internal container bind. The Compose host-published HTTP and metrics ports are loopback-only.
- The Kubernetes ConfigMap sample contains an example HTTPS origin, not the real production origin. Replace it with the exact approved hostname.
- `k8s/secret.yaml` is deliberately an empty template and does not configure a valid API token. Do not apply it as a live production secret. Create the Kubernetes Secret through a secure store or runtime secret injector. If using a protected file, store it outside the repository with restrictive permissions and create the Secret from that file; never place the token in a checked-in manifest or shell command history.
- The deployment does not advertise an unauthenticated Prometheus scrape. Before enabling scraping, configure the monitoring system to authenticate to the protected `/metrics` endpoint and keep that endpoint private.

## Operational checks before exposure

1. Terminate TLS at a trusted ingress/reverse proxy and enforce HTTPS externally.
2. Verify no public ingress, service, host port, or cloud load balancer exposes the API without the bearer-token boundary.
3. Keep metrics private to the monitoring network; configure the scraper to authenticate if it must access `/metrics`.
4. Set resource limits, request/body limits, timeouts, and rate limits appropriate to the workload.
5. Run as non-root, drop unnecessary capabilities, use a read-only filesystem where compatible, and disable service-account token mounting when Kubernetes workloads do not need it.
6. Store logs centrally with access controls; avoid logging Authorization headers or secrets. Restrict retention of client IPs and other personal data.
7. Review npm audit, CodeQL, Trivy, and secret-scanning results for the exact release commit. A configured workflow is not proof of a passing scan.
8. Test backup and restore, then preserve the tested release identifier and deployment configuration.

## Key rotation

Rotate the API token if exposure is confirmed or on an established rotation schedule. Coordinate server and client changes so legitimate clients are not stranded. If overlap is needed, design explicit multi-token support before rotation; the current middleware accepts one configured token.

## Repository controls

Configure a GitHub ruleset or branch protection on `main` requiring pull requests and passing checks. Restrict force pushes and branch deletion, and require review/conversation resolution. Verify the active rule in GitHub settings; workflow files alone do not enforce branch protection.

Do not merge when checks are failed, skipped unexpectedly, or unavailable for review. Inspect the actual Actions logs and annotations. Do not assume a short-running failed workflow is a runner problem without log evidence.

## Scope and verification

The API authentication and CORS changes are committed to a review branch and are not merged or deployed. No deployment secret has been created or rotated by this change. No live endpoint, production ingress, traffic, Kubernetes cluster, or active deployment was independently inspected. Production readiness is therefore not established.


## Local browser UI authentication

The static browser UI does not implement production user login or a secure session exchange. Never put `THALOS_API_TOKEN` into JavaScript, HTML, browser storage, query strings, or a frontend bundle.

For local development only, the API may bypass the bearer-token check when `APP_ENV` is explicitly set to `development`, `dev`, or `test` and `THALOS_AUTH_DISABLED=1`. Do not enable this in production, staging, CI deployments, or environments with an unknown mode.

Before production browser access, implement OIDC-backed user sessions or a trusted identity-aware gateway. The gateway must authenticate users, remove any client-supplied backend authorization header, inject the backend token server-side, and enforce administrator-only access to privileged paths. The service token alone does not provide per-user identity or role-based authorization.

The browser's Stop Server control is disabled. Use the trusted host, container orchestrator, or deployment control plane to stop the process.
