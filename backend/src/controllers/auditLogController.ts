import { Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';

export async function getAuditLogs(req: AuthRequest, res: Response) {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return res.json({ success: true, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
