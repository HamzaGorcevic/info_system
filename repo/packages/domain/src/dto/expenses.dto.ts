import { z } from 'zod';

export const createExpenseSchema = z.object({
    tenant_id: z.string().uuid(),
    expense_type: z.string().min(1),
    amount: z.number().positive(),
    description: z.string().optional(),
    status: z.enum(['unpaid', 'paid', 'cancelled']).optional().default('unpaid'),
    paid_at: z.string().datetime().nullable().optional()
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const notifyTenantSchema = z.object({
    message: z.string().min(1)
});

export type CreateExpenseDto = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseDto = z.infer<typeof updateExpenseSchema>;
export type NotifyTenantDto = z.infer<typeof notifyTenantSchema>;
