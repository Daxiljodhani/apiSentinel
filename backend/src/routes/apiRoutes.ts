import { Router } from 'express';
import {
  getApis,
  getApiById,
  createApi,
  updateApi,
  deleteApi,
  pauseApi,
  resumeApi,
  testApi,
} from '../controllers/apiController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/rbac';

const router = Router();

router.use(authenticate);

router.get('/', getApis);
router.get('/:id', getApiById);
router.post('/', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), createApi);
router.put('/:id', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), updateApi);
router.delete('/:id', authorizeRoles('OWNER', 'ADMIN'), deleteApi);
router.post('/:id/pause', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), pauseApi);
router.post('/:id/resume', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), resumeApi);
router.post('/:id/test', authorizeRoles('OWNER', 'ADMIN', 'DEVELOPER'), testApi);

export default router;
