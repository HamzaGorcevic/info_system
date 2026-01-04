import { Router } from 'express';
import { suggestionsController } from '../controllers/suggestions.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, suggestionsController.createSuggestion);
router.get('/building/:buildingId', authMiddleware, suggestionsController.getSuggestionsByBuilding);
router.delete('/:id', authMiddleware, suggestionsController.deleteSuggestion);
router.post('/vote', authMiddleware, suggestionsController.voteSuggestion);

export default router;
