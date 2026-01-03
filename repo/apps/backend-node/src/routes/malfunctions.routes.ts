import { Router } from 'express';
import { malfunctionsController } from '../controllers/malfunctions.controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), malfunctionsController.reportMalfunction);
router.get('/', malfunctionsController.getAllMalfunctions);
router.get('/tenant/:tenantId', malfunctionsController.getMalfunctions);
router.post('/rate', malfunctionsController.rateMalfunction);

export default router;
