# 🛡️ API Sentinel — Modern API Monitoring & Observability Platform

API Sentinel is a 100% free, lightweight, enterprise-style API Monitoring & Observability Platform built for developers, teams, and college project demonstrations. It runs entirely locally with zero paid third-party dependencies or Docker requirements!

![Theme](https://img.shields.io/badge/Theme-Dark_Navy_SaaS-07111F?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-100%25_Free_%26_Open_Source-22C55E?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-Full--Stack-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite_Local-003B57?style=for-the-badge&logo=sqlite)

---

## 🌟 Key Features

* **⚡ Real-Time API Uptime & Latency Monitoring**: Measure total latency, DNS lookup, TLS handshake, TCP connect, TTFB processing, and download times.
* **🛡️ SSL Certificate Expiration Auditing**: Proactive alerts for expiring HTTPS SSL certificates (30-day, 7-day, 1-day windows).
* **🔍 Response Validation Engine**: Write validation rules checking response status codes, header values, and JSON payload attributes.
* **🚨 Smart Alerting & Cooldowns**: Prevent notification spam using consecutive failure thresholds and recovery alerts.
* **🔥 Automated Incident Lifecycle**: Auto-detect downtime, open incident tickets with detailed diagnostic trace, update timeline, and auto-resolve upon recovery.
* **🌐 Public Status Pages**: Publish customizable operational status pages for customers and team stakeholders.
* **🏢 Team & Project RBAC**: Multi-tenant team management with Owner, Admin, Developer, and Viewer role-based access controls.
* **🔑 Environment Variables**: Interpolate environment variables (`{{BASE_URL}}`, `{{API_KEY}}`) across API check configurations.
* **📊 Analytics & Export**: Latency percentile breakdown (P50, P95, P99), calendar-style uptime grids, status code breakdown, and CSV reporting.
* **⚡ Command Palette & Global Search**: Instant navigation with `Ctrl + K` palette.

---

## 👥 4-Developer Module Allocation

| Module | Developer | Responsibilities |
|---|---|---|
| **Frontend & UI/UX** | **Developer 1** | Dark Navy Design System, Dashboard, Analytics UI, Command Palette, Forms, Landing Page, Public Status Page |
| **Backend & Core API** | **Developer 2** | Express Architecture, Auth (JWT + Passwords), RBAC, API CRUD, Projects, Environments, Teams |
| **Monitoring & Background Jobs** | **Developer 3** | Scheduled Worker Engine, HTTP Probe Execution, Latency Breakdown, SSL Audit, Response Validation Evaluator |
| **Analytics, Alerts & DevOps** | **Developer 4** | Alert Engine, Incident Automation, Analytics aggregation, Audit Logging, Documentation |

---

## 🚀 Simple & Free Setup (Zero Docker Required)

### Prerequisites
* **Node.js**: v18+ (You have v24 installed)
* **npm**: v9+ (You have v11 installed)

### 1. Install Dependencies & Setup Local Database
Run from the root directory:
```bash
npm run setup
```
*Installs frontend and backend dependencies, creates a zero-config local SQLite database, applies migrations, and populates 10 realistic sample APIs with historical monitoring data.*

### 2. Run Application Locally
```bash
npm run dev
```
*Launches both Backend (`http://localhost:5000`) and Frontend (`http://localhost:5173`) simultaneously!*

### 3. Login Credentials (Demo Seed Data)
* **Email**: `admin@sentinel.io`
* **Password**: `password123`

---

## 📁 Project Architecture

```
api-sentinel/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Free Local SQLite Database Schema
│   │   └── seed.ts             # Realistic 10-API seed & metrics
│   ├── src/
│   │   ├── controllers/        # REST route controllers
│   │   ├── middleware/         # Auth, RBAC, error handling
│   │   ├── routes/             # Express routing
│   │   ├── services/           # DB & business logic
│   │   ├── utils/              # Latency probe, HTTP client, validation
│   │   └── workers/            # Scheduled monitoring engine
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components, CommandPalette
│   │   ├── context/            # Auth, Socket, Theme context
│   │   ├── pages/              # Dashboard, APIs, Detail, Logs, Incidents, etc.
│   │   └── services/           # Axios API client
├── docs/                       # Architecture, DB, API & Engine Docs
└── README.md
```
