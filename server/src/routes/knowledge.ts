import { Router } from 'express';
import {
  getKnowledgeList,
  getKnowledgeById,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge
} from '../controllers/knowledgeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getKnowledgeList);
router.get('/:id', getKnowledgeById);
router.post('/', createKnowledge);
router.put('/:id', updateKnowledge);
router.delete('/:id', deleteKnowledge);

export default router;
