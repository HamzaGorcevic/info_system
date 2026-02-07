import z from 'zod';
import { servicerSchema } from '../entities/servicer.entity.js';

export const createServicerSchema = servicerSchema.omit({ id: true, created_at: true });
export const updateServicerSchema = servicerSchema.omit({ id: true, created_at: true }).partial();

export type CreateServicerDto = z.infer<typeof createServicerSchema>;
export type UpdateServicerDto = z.infer<typeof updateServicerSchema>;
