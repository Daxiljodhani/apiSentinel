import { Router } from 'express';
import { getStatusPages, getPublicStatusPage, createStatusPage } from '../controllers/statusPageController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

// Public endpoint (no auth)
router.get('/public/:slug', getPublicStatusPage);

// Authenticated management endpoints
router.get('/', authenticate, getStatusPages);
router.post('/', authenticate, authorizeRoles('OWNER', 'ADMIN'), createStatusPage);

export default router;
