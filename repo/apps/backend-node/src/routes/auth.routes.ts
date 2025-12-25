import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register-admin', authController.registerAdmin);
router.post('/register-tenant', authController.registerTenant);
router.post('/login', authController.login);
router.get('/buildings', authController.getAdminBuildings);

export default router;
