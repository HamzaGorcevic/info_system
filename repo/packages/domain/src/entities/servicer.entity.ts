import { z } from 'zod';
import { ratingSchema } from './rating.entity.js';

export const servicerSchema = z.object({
    id: z.string().uuid(),
    full_name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().nullable().optional(),
    company_name: z.string().nullable().optional(),
    profession: z.string().min(1),
    created_at: z.string().optional(),
    ratings: z.array(ratingSchema).optional(),
});

export type Servicer = z.infer<typeof servicerSchema>;
