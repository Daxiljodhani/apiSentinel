import { Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';

export async function getTeams(req: AuthRequest, res: Response) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } },
          },
        },
        projects: true,
      },
    });
    return res.json({ success: true, data: teams });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function inviteMember(req: AuthRequest, res: Response) {
  try {
    const { teamId, email, role } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role: role || 'DEVELOPER',
      },
    });

    return res.json({ success: true, data: member, message: 'Team member added successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
