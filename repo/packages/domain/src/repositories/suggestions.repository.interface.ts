import { Database } from '@repo/types';
import { CreateSuggestionInput, CreateSuggestionVoteInput, SuggestionWithVote } from '../entities/suggestion.entity.js';

export interface ISuggestionRepository {
    create(data: CreateSuggestionInput): Promise<Database['public']['Tables']['suggestions']['Row']>;
    findByBuildingId(buildingId: string, userId: string): Promise<SuggestionWithVote[]>;
    delete(id: string): Promise<void>;
    vote(data: CreateSuggestionVoteInput): Promise<void>;
}
