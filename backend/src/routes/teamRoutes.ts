import { Router } from 'express';
import { getTeams, inviteMember } from '../controllers/teamController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getTeams);
router.post('/invite', authorizeRoles('OWNER', 'ADMIN'), inviteMember);

export default router;
