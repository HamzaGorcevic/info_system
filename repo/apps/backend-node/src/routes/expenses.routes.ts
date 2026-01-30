import { Router } from 'express';
import { expensesController } from '../controllers/expenses.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', expensesController.createExpense);
router.get('/', expensesController.getAllExpenses);
router.get('/tenant/:tenantId', expensesController.getTenantExpenses);
router.patch('/:id', expensesController.updateExpense);
router.delete('/:id', expensesController.deleteExpense);
router.post('/:id/notify', expensesController.notifyTenant);

export default router;
