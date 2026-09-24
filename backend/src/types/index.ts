import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ProbeResult {
  isSuccess: boolean;
  statusCode?: number;
  responseTimeMs: number;
  dnsLookupTimeMs: number;
  tcpConnectTimeMs: number;
  tlsHandshakeTimeMs: number;
  serverProcessTimeMs: number;
  downloadTimeMs: number;
  responseSizeByte: number;
  responseBodySnippet?: string;
  errorMessage?: string;
}

export interface ValidationRule {
  field: string; // 'status', 'header.content-type', 'body.status', 'responseTime'
  operator: 'equals' | 'not_equals' | 'contains' | 'less_than' | 'greater_than' | 'not_null';
  value: any;
}
