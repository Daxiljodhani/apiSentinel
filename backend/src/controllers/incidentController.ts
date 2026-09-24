import { Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';

export async function getIncidents(req: AuthRequest, res: Response) {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') {
      if (status === 'ACTIVE') {
        where.status = { in: ['INVESTIGATING', 'IDENTIFIED', 'MONITORING'] };
      } else {
        where.status = String(status);
      }
    }

    const incidents = await prisma.incident.findMany({
      where,
      include: {
        api: { select: { id: true, name: true, url: true, method: true } },
        events: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { startedAt: 'desc' },
    });

    return res.json({ success: true, data: incidents });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function resolveIncident(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { rootCause } = req.body;

    const existing = await prisma.incident.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Incident not found' } });
    }

    const now = new Date();
    const durationSeconds = Math.floor((now.getTime() - existing.startedAt.getTime()) / 1000);

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: now,
        durationSeconds,
        rootCause: rootCause || existing.rootCause,
      },
    });

    await prisma.incidentEvent.create({
      data: {
        incidentId: id,
        status: 'RESOLVED',
        message: `Incident resolved manually by user ${req.user?.email}`,
      },
    });

    return res.json({ success: true, data: updated, message: 'Incident resolved' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
