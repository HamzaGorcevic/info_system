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

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1)
});

export const getAdminBuildingsQuerySchema = z.object({
    userId: z.string().uuid()
});

export type RegisterAdminInputDto = z.infer<typeof registerAdminSchema>;
export type LoginInputDto = z.infer<typeof loginSchema>;
export type RegisterTenantInputDto = z.infer<typeof registerTenantSchema>;
export type RefreshTokenInputDto = z.infer<typeof refreshTokenSchema>;
