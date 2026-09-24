# Database Schema & Entity Relationships

## Core Entities & Tables

1. **User**: Authentication, roles (`OWNER`, `ADMIN`, `DEVELOPER`, `VIEWER`), profiles.
2. **Team & TeamMember**: Organization hierarchy and membership permissions.
3. **Project & Environment**: Logic grouping of API monitors and environment variable templates (e.g., `{{BASE_URL}}`).
4. **ApiMonitor**: Target endpoint specs, methods, headers, authentication, probe frequencies (30s to 1h), expected status, timeouts, and rules.
5. **MonitoringResult**: Time-series health checks, DNS/TLS/TCP/Server breakdown timings, response size, and error payloads.
6. **SslCertificate**: Expiration parsing, issuer details, days remaining, health state.
7. **Incident & IncidentEvent**: Auto-generated downtime trackers with duration, root cause, timeline steps, and resolution states.
8. **AlertConfig & Notification**: Multi-channel alert rules with consecutive failure thresholds and cooldown timers.
9. **StatusPage & StatusPageService**: Public status pages with custom service mapping.
10. **AuditLog**: Compliance audit log of user actions (created API, modified environment, updated team role, etc.).
