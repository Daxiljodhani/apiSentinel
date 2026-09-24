import { Router } from 'express';
import { getAlerts, createAlert, toggleAlert, getNotifications, markNotificationsRead } from '../controllers/alertController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getAlerts);
router.post('/', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), createAlert);
router.post('/:id/toggle', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), toggleAlert);

router.get('/notifications', getNotifications);
router.post('/notifications/read', markNotificationsRead);

export default router;
