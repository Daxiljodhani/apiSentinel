import { Router } from 'express';
import { getDashboardStats, getLogs } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/logs', getLogs);

export default router;
