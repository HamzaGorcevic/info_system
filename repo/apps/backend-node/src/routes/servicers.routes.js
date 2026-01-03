import { Router } from 'express';
import { servicersController } from '../controllers/servicers.controller.js';
const router = Router();
router.post('/', servicersController.createServicer);
router.get('/', servicersController.getAllServicers);
router.post('/assign-token', servicersController.assignToken);
export default router;
