import { z } from 'zod';

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    full_name: z.string().min(2),
    role: z.enum(['manager', 'tenant']),
    is_verified: z.boolean().default(false),
    created_at: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
