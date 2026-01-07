import { Router } from 'express';
import { buildingController } from '../controllers/building.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/:buildingId/unverified-tenants', buildingController.findUnverifiedTenants);
router.get('/:buildingId/tenants', buildingController.getBuildingTenants);
router.post('/verify-tenant/:userId', buildingController.verifyTenant);
router.get('/tenant/:userId', buildingController.getTenantData);

export default router;
