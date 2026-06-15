import { Router } from 'express';
import { getMembers, inviteMember, updateMemberRole, removeMember } from '../controllers/membersController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getMembers);
router.post('/invite', requireRole('admin'), inviteMember);
router.put('/:id/role', requireRole('admin'), updateMemberRole);
router.delete('/:id', requireRole('admin'), removeMember);

export default router;
