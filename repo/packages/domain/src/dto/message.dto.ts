import { z } from 'zod';
import { messageSchema } from '../entities/message.entity.js';

export const createMessageSchema = messageSchema.omit({
    id: true,
    created_at: true
});

export const updateMessageSchema = messageSchema.omit({
    id: true,
    created_at: true,
    posted_by: true,
    building_id: true
}).partial();

export type CreateMessageDto = z.infer<typeof createMessageSchema>;
export type UpdateMessageDto = z.infer<typeof updateMessageSchema>;