import { Router } from 'express';
import { getEnterprise, updateEnterprise, getStats } from '../controllers/enterpriseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getEnterprise);
router.put('/', updateEnterprise);
router.get('/stats', getStats);

export default router;
