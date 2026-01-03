import { z } from 'zod';
export const malfunctionSchema = z.object({
    id: z.string().uuid(),
    tenant_id: z.string().uuid(),
    reporter_id: z.string().uuid(),
    servicer_id: z.string().uuid().nullable().optional(),
    image_url: z.string().nullable().optional(),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().nullable().optional(),
    status: z.enum(['reported', 'assigned', 'in_progress', 'resolved']).default('reported'),
    assigned_at: z.string().nullable().optional(),
    started_at: z.string().nullable().optional(),
    resolved_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
});
