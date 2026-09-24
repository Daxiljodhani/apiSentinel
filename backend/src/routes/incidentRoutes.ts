import { Router } from 'express';
import { getIncidents, resolveIncident } from '../controllers/incidentController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getIncidents);
router.post('/:id/resolve', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), resolveIncident);

export default router;
