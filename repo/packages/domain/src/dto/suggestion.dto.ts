import { z } from 'zod';
import { suggestionSchema, suggestionVoteSchema } from '../entities/suggestion.entity.js';

export const createSuggestionSchema = suggestionSchema.pick({
    building_id: true,
    title: true,
    content: true,
    created_by: true,
});

export const updateSuggestionSchema = suggestionSchema.omit({
    id: true,
    created_at: true,
    building_id: true,
    created_by: true
}).partial();

export const createSuggestionVoteSchema = suggestionVoteSchema.pick({
    suggestion_id: true,
    voted_by: true,
    vote: true,
});

export type CreateSuggestionDto = z.infer<typeof createSuggestionSchema>;
export type UpdateSuggestionDto = z.infer<typeof updateSuggestionSchema>;
export type CreateSuggestionVoteDto = z.infer<typeof createSuggestionVoteSchema>;
