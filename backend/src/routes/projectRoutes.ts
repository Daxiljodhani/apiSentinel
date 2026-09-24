import { Router } from 'express';
import { getProjects, createProject, getEnvironments, createEnvironmentVariable } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/projects', getProjects);
router.post('/projects', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), createProject);

router.get('/environments', getEnvironments);
router.post('/environments/variables', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), createEnvironmentVariable);

export default router;
