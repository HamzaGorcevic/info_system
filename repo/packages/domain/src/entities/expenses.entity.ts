import z from "zod";

export const expenseSchema = z.object({
    id: z.string().uuid(),
    tenant_id: z.string().uuid(),
    expense_type: z.string().min(1),
    amount: z.number().positive(),
    description: z.string().optional(),
    status: z.enum(['unpaid', 'paid', 'cancelled']).optional().default('unpaid'),
    paid_at: z.string().datetime().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    created_by: z.string().uuid()
});

export type Expense = z.infer<typeof expenseSchema>;