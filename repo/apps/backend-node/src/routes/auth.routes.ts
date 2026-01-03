import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validator.middleware.js';
import { registerAdminSchema, registerTenantSchema, loginSchema } from '@repo/domain';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register-admin', validate({ body: registerAdminSchema }), authController.registerAdmin);
router.post('/register-tenant', validate({ body: registerTenantSchema }), authController.registerTenant);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.get('/buildings', authMiddleware, authController.getAdminBuildings);

export default router;
