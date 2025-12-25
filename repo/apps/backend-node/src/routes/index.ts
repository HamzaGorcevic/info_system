import { Router } from 'express';
import authRoutes from './auth.routes.js';
import buildingRoutes from './building.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/buildings', buildingRoutes);

export default router;
