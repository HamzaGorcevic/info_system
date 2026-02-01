import { z } from 'zod';

export const guestAccessTokenSchema = z.object({
    id: z.string().uuid(),
    building_id: z.string().uuid(),
    malfunction_id: z.string().uuid(),
    servicer_id: z.string().uuid(),
    granted_by: z.string().uuid(),
    token: z.string(),
    expires_at: z.string(),
    is_active: z.boolean().nullable().optional(),
    last_used_at: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
});

export type GuestAccessToken = z.infer<typeof guestAccessTokenSchema>;
