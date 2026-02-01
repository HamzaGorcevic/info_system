import { z } from 'zod';
import { expenseSchema } from '../entities/expenses.entity';

export const createExpenseSchema = expenseSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    created_by: true,
    status: true,
});

export const updateExpenseSchema = expenseSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    created_by: true,
    tenant_id: true,
    expense_type: true,
    amount: true
});

export const notifyTenantSchema = z.object({
    message: z.string().min(1)
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
export type NotifyTenantDto = z.infer<typeof notifyTenantSchema>;
