import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, messagesController.createMessage);
router.get('/building/:buildingId', authMiddleware, messagesController.getMessagesByBuilding);
router.delete('/:id', authMiddleware, messagesController.deleteMessage);

export default router;
