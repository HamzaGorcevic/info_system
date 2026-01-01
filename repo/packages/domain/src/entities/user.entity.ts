import { z } from 'zod';

export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string().min(2),
    role: z.enum(['manager', 'tenant']),
    isVerified: z.boolean().default(false),
    createdAt: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = Omit<User, 'createdAt'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'email' | 'createdAt'>>;
