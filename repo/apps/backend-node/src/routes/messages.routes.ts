import { Router } from 'express';
import { messagesController } from '../controllers/messages.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { createMessageSchema } from '@repo/domain';

const router = Router();

router.use(authMiddleware)

router.post('/', validate({ body: createMessageSchema }), messagesController.createMessage);
router.get('/building/:buildingId', messagesController.getMessagesByBuilding);
router.delete('/:id', messagesController.deleteMessage);

export default router;
