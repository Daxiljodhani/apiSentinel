import { Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';
import { runApiProbe } from '../services/probeService';

export async function getApis(req: AuthRequest, res: Response) {
  try {
    const { search, status, projectId } = req.query;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { url: { contains: String(search) } },
      ];
    }
    if (status && status !== 'ALL') {
      where.status = String(status);
    }
    if (projectId) {
      where.projectId = String(projectId);
    }

    const apis = await prisma.apiMonitor.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        sslCertificate: true,
        _count: { select: { incidents: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Calculate 24h uptime for each API
    const result = await Promise.all(
      apis.map(async (api) => {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const checks = await prisma.monitoringResult.findMany({
          where: { apiId: api.id, timestamp: { gte: last24h } },
          select: { isSuccess: true, responseTimeMs: true },
        });

        const totalChecks = checks.length;
        const successChecks = checks.filter((c) => c.isSuccess).length;
        const uptimePercent = totalChecks > 0 ? ((successChecks / totalChecks) * 100).toFixed(2) : '100.00';
        const avgResponseMs =
          totalChecks > 0 ? Math.round(checks.reduce((acc, c) => acc + c.responseTimeMs, 0) / totalChecks) : 0;

        return {
          ...api,
          uptimePercent: parseFloat(uptimePercent),
          avgResponseMs,
          totalChecks,
        };
      })
    );

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function getApiById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const api = await prisma.apiMonitor.findUnique({
      where: { id },
      include: {
        project: { include: { environments: { include: { variables: true } } } },
        sslCertificate: true,
        alerts: true,
        incidents: { orderBy: { startedAt: 'desc' }, take: 10, include: { events: true } },
      },
    });

    if (!api) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'API monitor not found' } });
    }

    // Get recent check history (last 50 checks)
    const recentChecks = await prisma.monitoringResult.findMany({
      where: { apiId: id },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    // Compute uptime statistics
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const checks24h = await prisma.monitoringResult.findMany({
      where: { apiId: id, timestamp: { gte: last24h } },
      select: { isSuccess: true, responseTimeMs: true },
    });

    const total = checks24h.length;
    const success = checks24h.filter((c) => c.isSuccess).length;
    const uptime24h = total > 0 ? parseFloat(((success / total) * 100).toFixed(2)) : 100;
    const avgResponse24h = total > 0 ? Math.round(checks24h.reduce((a, c) => a + c.responseTimeMs, 0) / total) : 0;

    return res.json({
      success: true,
      data: {
        ...api,
        uptime24h,
        avgResponse24h,
        recentChecks,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function createApi(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      description,
      url,
      method,
      projectId,
      intervalSeconds,
      timeoutMs,
      expectedStatusCode,
      expectedResponseMs,
      headers,
      queryParams,
      body,
      authType,
      authConfig,
      validationRules,
    } = req.body;

    if (!name || !url || !projectId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Name, URL, and Project ID are required' },
      });
    }

    const api = await prisma.apiMonitor.create({
      data: {
        name,
        description,
        url,
        method: method || 'GET',
        projectId,
        intervalSeconds: parseInt(intervalSeconds) || 60,
        timeoutMs: parseInt(timeoutMs) || 5000,
        expectedStatusCode: parseInt(expectedStatusCode) || 200,
        expectedResponseMs: parseInt(expectedResponseMs) || 1000,
        headers: headers ? JSON.stringify(headers) : null,
        queryParams: queryParams ? JSON.stringify(queryParams) : null,
        body: body ? JSON.stringify(body) : null,
        authType: authType || 'NONE',
        authConfig: authConfig ? JSON.stringify(authConfig) : null,
        validationRules: validationRules ? JSON.stringify(validationRules) : null,
      },
    });

    // Create default alert config for API
    await prisma.alertConfig.create({
      data: {
        apiId: api.id,
        type: 'API_DOWN',
        consecutiveThreshold: 3,
        cooldownMinutes: 15,
        channelType: 'EMAIL',
        destination: req.user?.email || 'admin@sentinel.io',
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'API_CREATED',
        resource: api.name,
        details: `Created API monitor for ${api.url}`,
      },
    });

    // Trigger initial probe immediately
    runApiProbe(api.id).catch(() => {});

    return res.status(201).json({ success: true, data: api, message: 'API monitor created successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function updateApi(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const bodyData = req.body;

    const existing = await prisma.apiMonitor.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'API monitor not found' } });
    }

    const updated = await prisma.apiMonitor.update({
      where: { id },
      data: {
        name: bodyData.name,
        description: bodyData.description,
        url: bodyData.url,
        method: bodyData.method,
        intervalSeconds: bodyData.intervalSeconds ? parseInt(bodyData.intervalSeconds) : undefined,
        timeoutMs: bodyData.timeoutMs ? parseInt(bodyData.timeoutMs) : undefined,
        expectedStatusCode: bodyData.expectedStatusCode ? parseInt(bodyData.expectedStatusCode) : undefined,
        expectedResponseMs: bodyData.expectedResponseMs ? parseInt(bodyData.expectedResponseMs) : undefined,
        headers: bodyData.headers ? (typeof bodyData.headers === 'string' ? bodyData.headers : JSON.stringify(bodyData.headers)) : undefined,
        validationRules: bodyData.validationRules ? (typeof bodyData.validationRules === 'string' ? bodyData.validationRules : JSON.stringify(bodyData.validationRules)) : undefined,
      },
    });

    return res.json({ success: true, data: updated, message: 'API monitor updated successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function deleteApi(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const existing = await prisma.apiMonitor.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'API monitor not found' } });
    }

    await prisma.apiMonitor.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action: 'API_DELETED',
        resource: existing.name,
        details: `Deleted API monitor ${existing.id}`,
      },
    });

    return res.json({ success: true, message: 'API monitor deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function pauseApi(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const updated = await prisma.apiMonitor.update({
      where: { id },
      data: { isPaused: true, status: 'PAUSED' },
    });
    return res.json({ success: true, data: updated, message: 'API monitoring paused' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function resumeApi(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const updated = await prisma.apiMonitor.update({
      where: { id },
      data: { isPaused: false, status: 'HEALTHY' },
    });

    // Run immediate probe upon resume
    runApiProbe(id).catch(() => {});

    return res.json({ success: true, data: updated, message: 'API monitoring resumed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function testApi(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const result = await runApiProbe(id);

    return res.json({
      success: true,
      data: result,
      message: 'API probe test executed successfully',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
