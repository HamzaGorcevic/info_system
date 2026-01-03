import { z } from 'zod';
export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string().min(2),
    role: z.enum(['manager', 'tenant']),
    isVerified: z.boolean().default(false),
    createdAt: z.string().optional(),
});
