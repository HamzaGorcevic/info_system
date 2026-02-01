import z from "zod";

export const buildingSchema = z.object({
    id: z.string().uuid(),
    building_name: z.string().nullable().optional(),
    location: z.string().min(1),
    number_apartments: z.number().int().positive(),
    created_at: z.string().datetime().nullable().optional()
});

export type Building = z.infer<typeof buildingSchema>;
