import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { initWebSocketServer } from './services/wsService';
import { startMonitoringScheduler } from './workers/monitoringWorker';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import incidentRoutes from './routes/incidentRoutes';
import alertRoutes from './routes/alertRoutes';
import statusPageRoutes from './routes/statusPageRoutes';
import teamRoutes from './routes/teamRoutes';
import projectRoutes from './routes/projectRoutes';
import auditLogRoutes from './routes/auditLogRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Register API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/apis', apiRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/incidents', incidentRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/status-pages', statusPageRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1', projectRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'API Sentinel Backend', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

if (process.env.VERCEL !== '1') {
  const server = http.createServer(app);
  initWebSocketServer(server);
  startMonitoringScheduler();

  server.listen(port, () => {
    logger.info(`🛡️ API Sentinel Backend running on http://localhost:${port}`);
  });
}

export default app;
