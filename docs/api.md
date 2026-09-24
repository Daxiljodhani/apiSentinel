# API Sentinel — REST API Documentation

## Auth Endpoints
- `POST /api/v1/auth/register` — Register new user account.
- `POST /api/v1/auth/login` — Login user, returning JWT access & refresh tokens.
- `GET /api/v1/auth/me` — Current user profile.
- `POST /api/v1/auth/refresh` — Refresh access token.

## API Management & Testing
- `GET /api/v1/apis` — List all monitored APIs (supports search, project filter, status filter).
- `POST /api/v1/apis` — Create API monitor.
- `GET /api/v1/apis/:id` — Detailed API info with latency, SSL, incidents.
- `PUT /api/v1/apis/:id` — Update API monitor.
- `DELETE /api/v1/apis/:id` — Delete API monitor.
- `POST /api/v1/apis/:id/pause` — Pause monitoring.
- `POST /api/v1/apis/:id/resume` — Resume monitoring.
- `POST /api/v1/apis/:id/test` — Trigger instant live test execution.

## Analytics & Logs
- `GET /api/v1/analytics/dashboard` — Global top stats, response time percentiles (P50/P95/P99), uptime history.
- `GET /api/v1/logs` — Filterable time-series execution logs with search & status filters.

## Incidents & Alerts
- `GET /api/v1/incidents` — List open & resolved incidents.
- `POST /api/v1/incidents/:id/resolve` — Manually resolve an incident.
- `GET /api/v1/alerts` — List alert configurations.
- `POST /api/v1/alerts` — Create alert rule.

## Status Pages & Public Views
- `GET /api/v1/status-pages` — List configured status pages.
- `GET /api/v1/status-pages/public/:slug` — Public status page endpoint (no auth required).
