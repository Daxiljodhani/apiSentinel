# Monitoring Engine Architecture

The API Sentinel Monitoring Engine executes periodic probes across registered HTTP targets:

1. **Scheduler**: Iterates through active `ApiMonitor` records based on configured `intervalSeconds` (30s, 1m, 5m, 15m, 30m, 1h).
2. **HTTP Probe Execution**:
   - Accurately measures timing phases: DNS lookup, TCP Connection, TLS Handshake, Server Processing (TTFB), and Content Transfer.
   - Parses HTTP status code against `expectedStatusCode`.
   - Evaluates response time against `expectedResponseMs`.
   - Validates response body rules (e.g. `status == "success"`, `data != null`).
3. **SSL Audit**:
   - Parses TLS certificate expiration dates for `https://` URLs.
   - Calculates remaining days and flags `EXPIRING_SOON` (<30 days) or `EXPIRED` (<0 days).
4. **Alert & Incident Triggering**:
   - Increments `consecutiveFailures` counter.
   - Auto-creates an `Incident` if failures reach `consecutiveThreshold` (default 3).
   - Fires WebSocket updates to listening dashboard UI clients.
   - Resolves active incidents automatically when target recovers.
