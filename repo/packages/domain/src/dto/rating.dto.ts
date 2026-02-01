import z from "zod";
import { ratingSchema } from "../entities/rating.entity.js";

export const createRatingSchema = ratingSchema.omit({
    id: true,
    created_at: true
});

export const updateRatingSchema = createRatingSchema.partial();

export type CreateRatingDto = z.infer<typeof createRatingSchema>;
export type UpdateRatingDto = z.infer<typeof updateRatingSchema>;
