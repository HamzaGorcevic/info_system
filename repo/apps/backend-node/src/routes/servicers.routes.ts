import { Router } from 'express';
import { servicersController } from '../controllers/servicers.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { publicContextMiddleware } from '../middlewares/public-context.middleware.js';

const router = Router();

// Protected Routes
router.post('/', authMiddleware, servicersController.createServicer);
router.get('/', authMiddleware, servicersController.getAllServicers);
router.post('/assign-token', authMiddleware, servicersController.assignToken);
router.get('/tokens', authMiddleware, servicersController.getAllTokens);
router.post('/revoke-token', authMiddleware, servicersController.revokeToken);

// Public Routes
router.post('/verify-token', publicContextMiddleware, servicersController.verifyToken);
router.post('/update-status', publicContextMiddleware, servicersController.updateStatus);

export default router;
