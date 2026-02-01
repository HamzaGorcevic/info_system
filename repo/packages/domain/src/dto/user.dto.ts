import { z } from 'zod';
import { userSchema } from '../entities/user.entity.js';

export const createUserSchema = userSchema.omit({
    created_at: true
});

export const updateUserSchema = userSchema.omit({
    id: true,
    email: true,
    created_at: true
}).partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
