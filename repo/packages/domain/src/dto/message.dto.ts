import { z } from 'zod';
import { messageSchema } from '../entities/message.entity';

export const createMessageSchema = messageSchema.omit({
    id: true,
    created_at: true,
});

export type CreateMessageDto = z.infer<typeof createMessageSchema>;