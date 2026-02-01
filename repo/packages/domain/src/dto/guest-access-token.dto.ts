import { z } from 'zod';
import { guestAccessTokenSchema } from '../entities/guest-access-token.entity.js';

export const createGuestAccessTokenSchema = guestAccessTokenSchema.omit({
    id: true,
    created_at: true,
    last_used_at: true
});

export const updateGuestAccessTokenSchema = guestAccessTokenSchema.omit({
    id: true,
    created_at: true,
    building_id: true,
    malfunction_id: true,
    servicer_id: true,
    granted_by: true,
    token: true
}).partial();

export type CreateGuestAccessTokenDto = z.infer<typeof createGuestAccessTokenSchema>;
export type UpdateGuestAccessTokenDto = z.infer<typeof updateGuestAccessTokenSchema>;
