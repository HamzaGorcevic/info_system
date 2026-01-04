import { z } from 'zod';

export const eventSchema = z.object({
    id: z.string().uuid(),
    building_id: z.string().uuid(),
    title: z.string().min(1),
    scheduled_at: z.string(), // ISO date string
    content: z.string().nullable().optional(),
    created_by: z.string().uuid(),
    created_at: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;
export type CreateEventInput = Omit<Event, 'id' | 'created_at'>;
export type UpdateEventInput = Partial<Omit<Event, 'id' | 'created_at' | 'created_by' | 'building_id'>>;
