import { z } from 'zod';

export const messageSchema = z.object({
    id: z.string().uuid(),
    building_id: z.string().uuid(),
    posted_by: z.string().uuid(),
    content: z.string().min(1),
    message_type: z.string().nullable().optional(),
    created_at: z.string().optional(),
});

export type Message = z.infer<typeof messageSchema>;
