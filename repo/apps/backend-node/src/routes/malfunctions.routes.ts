import { Router } from 'express';
import { malfunctionsController } from '../controllers/malfunctions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { createMalfunctionRequestSchema, rateMalfunctionSchema } from '@repo/domain';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);

router.post('/', upload.single('image'), validate({ body: createMalfunctionRequestSchema }), malfunctionsController.reportMalfunction);
router.get('/', malfunctionsController.getAllMalfunctions);
router.get('/tenant/:tenantId', malfunctionsController.getMalfunctions);
router.post('/rate', validate({ body: rateMalfunctionSchema }), malfunctionsController.rateMalfunction);

export default router;
