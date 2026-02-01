import { z } from 'zod';
import { documentSchema } from '../entities/document.entity.js';

export const createDocumentSchema = documentSchema.omit({
    id: true,
    created_at: true
});

export const updateDocumentSchema = documentSchema.omit({
    id: true,
    created_at: true
}).partial();

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
