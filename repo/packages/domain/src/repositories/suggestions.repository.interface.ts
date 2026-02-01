import { Suggestion, SuggestionWithVote } from '../entities/suggestion.entity.js';
import { CreateSuggestionDto, CreateSuggestionVoteDto } from '../dto/suggestion.dto.js';

export interface ISuggestionRepository {
    create(data: CreateSuggestionDto): Promise<Suggestion>;
    findByBuildingId(buildingId: string, userId: string): Promise<SuggestionWithVote[]>;
    delete(id: string): Promise<void>;
    vote(data: CreateSuggestionVoteDto): Promise<void>;
}
