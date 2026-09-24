import { Request, Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';

export async function getStatusPages(req: AuthRequest, res: Response) {
  try {
    const pages = await prisma.statusPage.findMany({
      include: {
        services: { include: { api: { select: { id: true, name: true, status: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: pages });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function getPublicStatusPage(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const page = await prisma.statusPage.findUnique({
      where: { slug },
      include: {
        services: {
          include: {
            api: {
              select: {
                id: true,
                name: true,
                status: true,
                url: true,
                method: true,
                lastCheckedAt: true,
              },
            },
          },
        },
      },
    });

    if (!page || !page.isPublic) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Status page not found or is private' } });
    }

    // Determine overall status
    const statuses = page.services.map((s) => s.api.status);
    let overallStatus: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' = 'OPERATIONAL';
    if (statuses.includes('DOWN')) {
      overallStatus = 'OUTAGE';
    } else if (statuses.includes('DEGRADED')) {
      overallStatus = 'DEGRADED';
    }

    // Get active incidents
    const apiIds = page.services.map((s) => s.api.id);
    const activeIncidents = await prisma.incident.findMany({
      where: { apiId: { in: apiIds }, status: { in: ['INVESTIGATING', 'IDENTIFIED', 'MONITORING'] } },
      include: { api: { select: { name: true } }, events: true },
    });

    return res.json({
      success: true,
      data: {
        ...page,
        overallStatus,
        activeIncidents,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function createStatusPage(req: AuthRequest, res: Response) {
  try {
    const { name, slug, description, apiIds } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Name and slug are required' },
      });
    }

    const page = await prisma.statusPage.create({
      data: {
        name,
        slug,
        description,
        isPublic: true,
        services: {
          create: (apiIds || []).map((apiId: string) => ({
            apiId,
            displayName: name,
          })),
        },
      },
    });

    return res.status(201).json({ success: true, data: page, message: 'Status page created successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
