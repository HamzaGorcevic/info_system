import { Router } from 'express';
import { expensesController } from '../controllers/expenses.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import { createExpenseSchema, updateExpenseSchema, notifyTenantSchema } from '@repo/domain';
import { z } from 'zod';

const router = Router();

const uuidParamSchema = z.object({ id: z.string().uuid() });

router.use(authMiddleware);

router.post('/', validate({ body: createExpenseSchema }), expensesController.createExpense);
router.get('/', expensesController.getAllExpenses);
router.get('/tenant/:tenantId', expensesController.getTenantExpenses);
router.patch('/:id', validate({ params: uuidParamSchema, body: updateExpenseSchema }), expensesController.updateExpense);
router.delete('/:id', validate({ params: uuidParamSchema }), expensesController.deleteExpense);
router.post('/:id/notify', validate({ params: uuidParamSchema, body: notifyTenantSchema }), expensesController.notifyTenant);

export default router;
