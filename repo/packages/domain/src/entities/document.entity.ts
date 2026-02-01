import { z } from 'zod';

export const documentSchema = z.object({
    id: z.string().uuid(),
    building_id: z.string().uuid(),
    title: z.string().min(1),
    file_url: z.string().url(),
    created_at: z.string().datetime().optional(),
    uploaded_by: z.string().uuid(),
});

export type Document = z.infer<typeof documentSchema>;
