import { prisma } from './prisma';
import { executeHttpProbe, checkSslCertificate } from '../utils/httpProbe';
import { evaluateValidationRules } from '../utils/validationEvaluator';
import { broadcastEvent } from './wsService';
import { logger } from '../utils/logger';

export async function runApiProbe(apiId: string) {
  const api = await prisma.apiMonitor.findUnique({
    where: { id: apiId },
    include: {
      project: {
        include: {
          environments: {
            include: { variables: true },
          },
        },
      },
    },
  });

  if (!api || api.isPaused) {
    return null;
  }

  // Interpolate Environment Variables if present
  let targetUrl = api.url;
  let targetHeaders: Record<string, string> = {};
  if (api.headers) {
    try {
      targetHeaders = JSON.parse(api.headers);
    } catch {}
  }

  const envVars = api.project.environments[0]?.variables || [];
  for (const v of envVars) {
    targetUrl = targetUrl.replace(new RegExp(`{{${v.key}}}`, 'g'), v.value);
  }

  let authConfig: any = null;
  if (api.authConfig) {
    try {
      authConfig = JSON.parse(api.authConfig);
    } catch {}
  }

  // 1. Execute HTTP Probe
  const probeResult = await executeHttpProbe(
    targetUrl,
    api.method,
    targetHeaders,
    api.queryParams ? JSON.parse(api.queryParams) : {},
    api.body,
    api.timeoutMs,
    api.authType,
    authConfig
  );

  // 2. Evaluate Validation Rules
  let rules: any[] = [];
  if (api.validationRules) {
    try {
      rules = JSON.parse(api.validationRules);
    } catch {}
  }

  const validation = evaluateValidationRules(
    rules,
    probeResult.statusCode,
    probeResult.responseTimeMs,
    probeResult.responseBodySnippet
  );

  let isSuccess = probeResult.isSuccess && validation.isValid;
  let errorMessage = probeResult.errorMessage;

  if (probeResult.isSuccess && !validation.isValid) {
    isSuccess = false;
    errorMessage = validation.failureReason;
  } else if (probeResult.isSuccess && probeResult.statusCode !== api.expectedStatusCode) {
    isSuccess = false;
    errorMessage = `Expected HTTP ${api.expectedStatusCode} but received ${probeResult.statusCode}`;
  }

  // Determine API Health Status
  let newStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN' = 'HEALTHY';
  let consecutiveFailures = isSuccess ? 0 : api.consecutiveFailures + 1;

  if (!isSuccess) {
    newStatus = 'DOWN';
  } else if (probeResult.responseTimeMs > api.expectedResponseMs) {
    newStatus = 'DEGRADED';
  } else {
    newStatus = 'HEALTHY';
  }

  // 3. Save MonitoringResult
  const checkRecord = await prisma.monitoringResult.create({
    data: {
      apiId: api.id,
      isSuccess,
      statusCode: probeResult.statusCode || null,
      responseTimeMs: probeResult.responseTimeMs,
      dnsLookupTimeMs: probeResult.dnsLookupTimeMs,
      tcpConnectTimeMs: probeResult.tcpConnectTimeMs,
      tlsHandshakeTimeMs: probeResult.tlsHandshakeTimeMs,
      serverProcessTimeMs: probeResult.serverProcessTimeMs,
      downloadTimeMs: probeResult.downloadTimeMs,
      responseSizeByte: probeResult.responseSizeByte,
      responseBodySnippet: probeResult.responseBodySnippet || null,
      errorMessage: errorMessage || null,
    },
  });

  // 4. Update API Monitor Status
  await prisma.apiMonitor.update({
    where: { id: api.id },
    data: {
      status: newStatus,
      consecutiveFailures,
      lastCheckedAt: new Date(),
    },
  });

  // 5. SSL Check
  if (targetUrl.startsWith('https://')) {
    const ssl = await checkSslCertificate(targetUrl);
    await prisma.sslCertificate.upsert({
      where: { apiId: api.id },
      create: {
        apiId: api.id,
        issuer: ssl.issuer || 'Unknown',
        validFrom: ssl.validFrom,
        validTo: ssl.validTo,
        daysRemaining: ssl.daysRemaining,
        status: ssl.status,
      },
      update: {
        issuer: ssl.issuer || 'Unknown',
        validFrom: ssl.validFrom,
        validTo: ssl.validTo,
        daysRemaining: ssl.daysRemaining,
        status: ssl.status,
        lastCheckedAt: new Date(),
      },
    });
  }

  // 6. Handle Incident Auto-Creation / Auto-Resolution
  if (!isSuccess && consecutiveFailures >= 3) {
    // Check if open incident exists
    const existingIncident = await prisma.incident.findFirst({
      where: { apiId: api.id, status: { in: ['INVESTIGATING', 'IDENTIFIED', 'MONITORING'] } },
    });

    if (!existingIncident) {
      const incident = await prisma.incident.create({
        data: {
          apiId: api.id,
          title: `${api.name} Down — ${errorMessage || 'Probe Failure'}`,
          status: 'INVESTIGATING',
          failedCheckCount: consecutiveFailures,
          rootCause: errorMessage || 'Server unreachable or returned unexpected status code.',
        },
      });

      await prisma.incidentEvent.create({
        data: {
          incidentId: incident.id,
          status: 'INVESTIGATING',
          message: `Automated probe detected ${consecutiveFailures} consecutive failures. (${errorMessage})`,
        },
      });

      broadcastEvent('INCIDENT_CREATED', incident);
    } else {
      await prisma.incident.update({
        where: { id: existingIncident.id },
        data: { failedCheckCount: existingIncident.failedCheckCount + 1 },
      });
    }
  } else if (isSuccess && newStatus === 'HEALTHY') {
    // Check if open incident needs auto-resolution
    const existingIncident = await prisma.incident.findFirst({
      where: { apiId: api.id, status: { in: ['INVESTIGATING', 'IDENTIFIED', 'MONITORING'] } },
    });

    if (existingIncident) {
      const now = new Date();
      const durationSeconds = Math.floor((now.getTime() - existingIncident.startedAt.getTime()) / 1000);

      const resolved = await prisma.incident.update({
        where: { id: existingIncident.id },
        data: {
          status: 'RESOLVED',
          resolvedAt: now,
          durationSeconds,
        },
      });

      await prisma.incidentEvent.create({
        data: {
          incidentId: existingIncident.id,
          status: 'RESOLVED',
          message: `API Sentinel health check passed. HTTP ${probeResult.statusCode} in ${probeResult.responseTimeMs}ms. Incident resolved.`,
        },
      });

      broadcastEvent('INCIDENT_RESOLVED', resolved);
    }
  }

  // 7. Broadcast WebSocket Update
  broadcastEvent('MONITOR_CHECK_COMPLETED', {
    apiId: api.id,
    apiName: api.name,
    status: newStatus,
    responseTimeMs: probeResult.responseTimeMs,
    statusCode: probeResult.statusCode,
    timestamp: new Date().toISOString(),
    checkRecord,
  });

  return checkRecord;
}
