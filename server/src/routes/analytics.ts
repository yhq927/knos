import { Router } from 'express';
import {
  getOverview,
  getHotQuestions,
  getUncoveredQuestions,
  getUserRanking
} from '../controllers/analyticsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/overview', getOverview);
router.get('/hot', getHotQuestions);
router.get('/uncovered', getUncoveredQuestions);
router.get('/ranking', getUserRanking);

export default router;
