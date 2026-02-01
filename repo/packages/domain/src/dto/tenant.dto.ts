import { z } from 'zod';
import { tenantSchema } from '../entities/tenant.entity.js';

export const createTenantSchema = tenantSchema.omit({
    id: true,
    created_at: true,
    buildings: true,
    users: true
});

export const updateTenantSchema = createTenantSchema.partial();

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
