import { z } from 'zod';
import { malfunctionSchema } from '../entities/malfunction.entity.js';

export const createMalfunctionSchema = malfunctionSchema.omit({
    id: true,
    created_at: true,
    status: true,
    assigned_at: true,
    started_at: true,
    resolved_at: true,
    ratings: true
});

export const createMalfunctionRequestSchema = createMalfunctionSchema.omit({
    reporter_id: true,
    image_url: true
}).extend({
    image_url: z.string().optional()
});

export const rateMalfunctionSchema = z.object({
    malfunction_id: z.string().uuid(),
    servicer_id: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
});

export type CreateMalfunctionDto = z.infer<typeof createMalfunctionSchema>;
export type CreateMalfunctionRequestDto = z.infer<typeof createMalfunctionRequestSchema>;
export type RateMalfunctionDto = z.infer<typeof rateMalfunctionSchema>;
