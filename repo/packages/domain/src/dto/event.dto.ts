import z from "zod";
import { eventSchema } from "../entities/event.entity.js";

export const CreateEventSchema = eventSchema.omit({
    id: true,
    created_at: true,
})

export const UpdateEventSchema = eventSchema.omit({
    id: true,
    created_at: true,
    created_by: true,
    building_id: true
})


export type CreateEventDto = z.infer<typeof CreateEventSchema>;
export type UpdateEventDto = z.infer<typeof UpdateEventSchema>;
