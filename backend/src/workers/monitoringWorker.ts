import cron from 'node-cron';
import { prisma } from '../services/prisma';
import { runApiProbe } from '../services/probeService';
import { logger } from '../utils/logger';

let isRunning = false;

export function startMonitoringScheduler() {
  logger.info('🚀 Initializing Monitoring Engine Background Scheduler (Every 30 seconds)...');

  // Run every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    if (isRunning) return;
    isRunning = true;

    try {
      const activeApis = await prisma.apiMonitor.findMany({
        where: { isPaused: false },
        select: { id: true, name: true, intervalSeconds: true, lastCheckedAt: true },
      });

      const now = Date.now();

      for (const api of activeApis) {
        const lastChecked = api.lastCheckedAt ? api.lastCheckedAt.getTime() : 0;
        const intervalMs = (api.intervalSeconds || 60) * 1000;

        if (now - lastChecked >= intervalMs) {
          logger.info(`🔍 Running background check for: ${api.name}`);
          runApiProbe(api.id).catch((err) => logger.error(`Error running probe for ${api.id}:`, err));
        }
      }
    } catch (err) {
      logger.error('Error in monitoring worker scheduler iteration:', err);
    } finally {
      isRunning = false;
    }
  });
}
