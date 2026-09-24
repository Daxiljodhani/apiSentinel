# API Sentinel Architecture Documentation

## Overview
API Sentinel is designed around a decoupled microservice-ready modular architecture:

1. **Client Tier**: Single Page Application built with React 18, TypeScript, Vite, Tailwind CSS, and Recharts.
2. **Gateway Tier**: Node.js & Express API Gateway executing authentication, RBAC, input validation, rate limiting, and RESTful resource operations.
3. **Engine Tier**: Node.js worker & cron background monitoring engine providing non-blocking http health checks, response metrics parsing, SSL expiration auditing, and automated incident state evaluation.
4. **Data Tier**: Prisma ORM with SQLite (for zero-dependency local runs) or PostgreSQL (for production deployments).

## High-Level Sequence Diagram

```
[ User UI ] ──(1) Create API Monitor ──> [ Express Gateway ]
                                                │
                                                ▼ (2) Save Config
                                        [ DB (Prisma) ]
                                                ▲
                                                │
                                    (3) Read Active Monitors
                                                │
[ Target API ] <──(4) Execute Probe ─── [ Monitoring Engine ]
      │                                         │
      └──(5) Return Response ───────────────────┘
                                                │
                                                ▼ (6) Store Metrics & Check Failure Rules
                                        [ DB (Prisma) ]
                                                │
                                                ▼ (7) If Failure / Recovery
                                        [ Alert / Incident Engine ] ──> [ WebSockets / Notifications ]
```
