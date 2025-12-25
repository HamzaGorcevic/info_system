import { Router } from 'express';
import { buildingController } from '../controllers/building.controller.js';

const router = Router();

router.get('/:buildingId/unverified-tenants', buildingController.getUnverifiedTenants);
router.post('/verify-tenant/:userId', buildingController.verifyTenant);
router.get('/tenant/:userId', buildingController.getTenantData);

export default router;
