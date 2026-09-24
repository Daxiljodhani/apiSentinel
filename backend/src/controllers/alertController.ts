import { Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';

export async function getAlerts(req: AuthRequest, res: Response) {
  try {
    const alerts = await prisma.alertConfig.findMany({
      include: { api: { select: { id: true, name: true, url: true } } },
      orderBy: { isEnabled: 'desc' },
    });
    return res.json({ success: true, data: alerts });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function createAlert(req: AuthRequest, res: Response) {
  try {
    const { apiId, type, consecutiveThreshold, cooldownMinutes, channelType, destination } = req.body;

    if (!apiId || !type || !destination) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'API ID, alert type, and destination are required' },
      });
    }

    const alert = await prisma.alertConfig.create({
      data: {
        apiId,
        type,
        consecutiveThreshold: parseInt(consecutiveThreshold) || 3,
        cooldownMinutes: parseInt(cooldownMinutes) || 15,
        channelType: channelType || 'EMAIL',
        destination,
      },
    });

    return res.status(201).json({ success: true, data: alert, message: 'Alert rule created' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function toggleAlert(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.alertConfig.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Alert rule not found' } });
    }

    const updated = await prisma.alertConfig.update({
      where: { id },
      data: { isEnabled: !existing.isEnabled },
    });

    return res.json({ success: true, data: updated, message: `Alert ${updated.isEnabled ? 'enabled' : 'disabled'}` });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user?.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return res.json({ success: true, data: notifications });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function markNotificationsRead(req: AuthRequest, res: Response) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user?.userId, isRead: false },
      data: { isRead: true },
    });
    return res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
