export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'DEVELOPER' | 'VIEWER';
  avatarUrl?: string;
  createdAt?: string;
}

export interface ApiMonitor {
  id: string;
  name: string;
  description?: string;
  url: string;
  method: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'PAUSED';
  intervalSeconds: number;
  timeoutMs: number;
  expectedStatusCode: number;
  expectedResponseMs: number;
  isPaused: boolean;
  consecutiveFailures: number;
  lastCheckedAt?: string;
  uptimePercent?: number;
  avgResponseMs?: number;
  project?: { id: string; name: string };
  sslCertificate?: SslCertificate;
  headers?: string;
  queryParams?: string;
  body?: string;
  authType?: string;
  authConfig?: string;
  validationRules?: string;
  recentChecks?: MonitoringResult[];
  incidents?: Incident[];
}

export interface MonitoringResult {
  id: string;
  apiId: string;
  timestamp: string;
  isSuccess: boolean;
  statusCode?: number;
  responseTimeMs: number;
  dnsLookupTimeMs: number;
  tcpConnectTimeMs: number;
  tlsHandshakeTimeMs: number;
  serverProcessTimeMs: number;
  downloadTimeMs: number;
  responseSizeByte: number;
  responseBodySnippet?: string;
  errorMessage?: string;
  api?: { id: string; name: string; url: string; method: string };
}

export interface SslCertificate {
  id: string;
  issuer?: string;
  validFrom?: string;
  validTo?: string;
  daysRemaining?: number;
  status: 'HEALTHY' | 'EXPIRING_SOON' | 'EXPIRED';
}

export interface Incident {
  id: string;
  apiId: string;
  title: string;
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
  startedAt: string;
  resolvedAt?: string;
  durationSeconds?: number;
  failedCheckCount: number;
  rootCause?: string;
  api?: { id: string; name: string; url: string; method: string };
  events?: IncidentEvent[];
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  status: string;
  message: string;
  createdAt: string;
}

export interface AlertConfig {
  id: string;
  apiId: string;
  type: string;
  consecutiveThreshold: number;
  cooldownMinutes: number;
  channelType: string;
  destination: string;
  isEnabled: boolean;
  api?: { id: string; name: string; url: string };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INCIDENT' | 'ALERT' | 'RECOVERY' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  environments?: Environment[];
  _count?: { apis: number };
}

export interface Environment {
  id: string;
  name: string;
  projectId: string;
  variables?: EnvironmentVariable[];
}

export interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
  isSecret: boolean;
}

export interface StatusPage {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isPublic: boolean;
  overallStatus?: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  services?: { id: string; displayName: string; api: ApiMonitor }[];
  activeIncidents?: Incident[];
}

export interface DashboardStats {
  totalApis: number;
  healthyApis: number;
  degradedApis: number;
  downApis: number;
  pausedApis: number;
  activeIncidents: number;
  globalUptime: number;
  avgResponseTimeMs: number;
  totalChecks: number;
  percentiles: { p50: number; p95: number; p99: number };
  statusCodeDistribution: { code: string; count: number; percentage: number }[];
  hourlyTrend: { time: string; avgResponseTimeMs: number; uptime: number }[];
}
