import z from "zod";

export const tenantSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    building_id: z.string().uuid(),
    apartment_number: z.number().int().positive(),
    tenant_number: z.number().int().positive(),
    is_owner: z.boolean().nullable().optional(),
    created_at: z.string().datetime().nullable().optional(),
    buildings: z.object({
        id: z.string().uuid(),
        building_name: z.string().nullable(),
        location: z.string(),
        number_apartments: z.number()
    }).optional(),
    users: z.object({
        id: z.string().uuid(),
        full_name: z.string(),
        email: z.string(),
        is_verified: z.boolean().nullable(),
        role: z.string()
    }).optional()
});

export type Tenant = z.infer<typeof tenantSchema>;
