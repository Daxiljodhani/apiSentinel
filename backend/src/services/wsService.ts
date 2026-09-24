import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { logger } from '../utils/logger';

let wss: WebSocketServer | null = null;

export function initWebSocketServer(server: Server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    logger.info('🔌 New WebSocket client connected');

    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'API Sentinel WebSocket connected' }));

    ws.on('close', () => {
      logger.info('🔌 Client disconnected from WebSocket');
    });
  });

  logger.info('⚡ WebSocket Server initialized on path /ws');
}

export function broadcastEvent(type: string, payload: any) {
  if (!wss) return;

  const data = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}
