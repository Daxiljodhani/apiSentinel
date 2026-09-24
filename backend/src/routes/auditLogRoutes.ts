import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditLogController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getAuditLogs);

export default router;
