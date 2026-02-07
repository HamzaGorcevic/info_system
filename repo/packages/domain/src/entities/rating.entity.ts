import z from "zod";

export const ratingSchema = z.object({
    id: z.string().uuid(),
    intervention_id: z.string().uuid(),
    rated_by: z.string().uuid(),
    rating_score: z.number().min(1).max(5),
    comment: z.string().nullable().optional(),
    servicer_id: z.string().uuid(),
    created_at: z.string().datetime().nullable().optional()
});

export type Rating = z.infer<typeof ratingSchema>;
