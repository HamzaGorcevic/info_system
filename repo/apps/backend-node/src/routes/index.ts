import { Router } from 'express';
import authRoutes from './auth.routes.js';
import buildingRoutes from './building.routes.js';
import malfunctionRoutes from './malfunctions.routes.js';
import servicerRoutes from './servicers.routes.js';
import eventRoutes from './events.routes.js';
import messageRoutes from './messages.routes.js';
import suggestionRoutes from './suggestions.routes.js';
import documentsRoutes from './documents.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);
router.use('/malfunctions', malfunctionRoutes);
router.use('/servicers', servicerRoutes);
router.use('/events', eventRoutes);
router.use('/messages', messageRoutes);
router.use('/suggestions', suggestionRoutes);
router.use('/documents', documentsRoutes);

export default router;
