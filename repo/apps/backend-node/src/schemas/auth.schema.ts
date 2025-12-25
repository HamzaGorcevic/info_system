import { z } from 'zod';

export const registerAdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    buildingName: z.string().min(2),
    location: z.string().min(2),
    numberApartments: z.number().min(1),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const registerTenantSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    buildingId: z.string().uuid(),
    apartmentNumber: z.number().min(1),
});

export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterTenantInput = z.infer<typeof registerTenantSchema>;
