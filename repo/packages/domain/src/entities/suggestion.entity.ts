import { z } from 'zod';

export const suggestionSchema = z.object({
    id: z.string().uuid(),
    building_id: z.string().uuid(),
    created_by: z.string().uuid(),
    title: z.string().min(1),
    content: z.string().min(1),
    status: z.string().optional(),
    percentage_of_votes: z.number().optional(),
    created_at: z.string().optional(),
});

export type Suggestion = z.infer<typeof suggestionSchema>;

export const suggestionVoteSchema = z.object({
    id: z.string().uuid(),
    suggestion_id: z.string().uuid(),
    voted_by: z.string().uuid(),
    vote: z.boolean(),
    created_at: z.string().optional(),
});

export type SuggestionVote = z.infer<typeof suggestionVoteSchema>;

export interface SuggestionWithVote extends Suggestion {
    upvotes: number;
    downvotes: number;
    user_vote?: boolean | null; // true = up, false = down, null/undefined = no vote
}
