import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validator.middleware.js';
import { registerAdminSchema, registerTenantSchema, loginSchema, refreshTokenSchema, getAdminBuildingsQuerySchema } from '@repo/domain';

import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register-admin', validate({ body: registerAdminSchema }), authController.registerAdmin);
router.post('/register-tenant', validate({ body: registerTenantSchema }), authController.registerTenant);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/refresh', validate({ body: refreshTokenSchema }), authController.refreshToken);
router.get('/buildings', authMiddleware, validate({ query: getAdminBuildingsQuerySchema }), authController.getAdminBuildings);

export default router;
