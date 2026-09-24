import { Response } from 'express';
import { prisma } from '../services/prisma';
import { AuthRequest } from '../types';

export async function getProjects(req: AuthRequest, res: Response) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        environments: { include: { variables: true } },
        _count: { select: { apis: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: projects });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function createProject(req: AuthRequest, res: Response) {
  try {
    const { name, description, teamId } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Project name is required' } });
    }

    let defaultTeamId = teamId;
    if (!defaultTeamId) {
      const team = await prisma.team.findFirst();
      defaultTeamId = team?.id;
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        teamId: defaultTeamId,
        environments: {
          create: [
            { name: 'Production' },
            { name: 'Staging' },
            { name: 'Development' },
          ],
        },
      },
    });

    return res.status(201).json({ success: true, data: project, message: 'Project created' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function getEnvironments(req: AuthRequest, res: Response) {
  try {
    const envs = await prisma.environment.findMany({
      include: { variables: true, project: { select: { name: true } } },
    });
    return res.json({ success: true, data: envs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}

export async function createEnvironmentVariable(req: AuthRequest, res: Response) {
  try {
    const { environmentId, key, value, isSecret } = req.body;

    if (!environmentId || !key || !value) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Environment ID, Key, and Value are required' } });
    }

    const variable = await prisma.environmentVariable.create({
      data: {
        environmentId,
        key,
        value,
        isSecret: Boolean(isSecret),
      },
    });

    return res.status(201).json({ success: true, data: variable, message: 'Variable added successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
}
