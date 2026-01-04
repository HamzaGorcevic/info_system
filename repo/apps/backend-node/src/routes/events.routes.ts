import { Router } from 'express';
import { eventsController } from '../controllers/events.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, eventsController.createEvent);
router.get('/building/:buildingId', authMiddleware, eventsController.getEventsByBuilding);
router.put('/:id', authMiddleware, eventsController.updateEvent);
router.delete('/:id', authMiddleware, eventsController.deleteEvent);

export default router;
