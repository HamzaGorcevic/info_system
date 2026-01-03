import { Router } from 'express';
import { servicersController } from '../controllers/servicers.controller.js';

const router = Router();

router.post('/', servicersController.createServicer);
router.get('/', servicersController.getAllServicers);
router.post('/assign-token', servicersController.assignToken);
router.post('/verify-token', servicersController.verifyToken);
router.post('/update-status', servicersController.updateStatus);
router.get('/tokens', servicersController.getAllTokens);
router.post('/revoke-token', servicersController.revokeToken);

export default router;
