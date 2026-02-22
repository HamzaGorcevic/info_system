import { Router } from 'express';
import { documentsController } from '../controllers/documents.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

const router = Router();

router.use(authMiddleware);

router.post('/', upload.single('file'), documentsController.upload);
router.get('/building/:buildingId', documentsController.getByBuilding);
router.delete('/:id', documentsController.delete);

export default router;
