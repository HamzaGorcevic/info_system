import { ISuggestionRepository, CreateSuggestionInput, CreateSuggestionVoteInput, SuggestionWithVote } from "@repo/domain";
import { Database } from "@repo/types";

export class SuggestionsService {
    constructor(
        private suggestionsRepository: ISuggestionRepository
    ) { }

    async createSuggestion(
        data: CreateSuggestionInput
    ): Promise<Database['public']['Tables']['suggestions']['Row']> {
        return this.suggestionsRepository.create(data);
    }

    async getSuggestionsByBuilding(buildingId: string, userId: string): Promise<SuggestionWithVote[]> {
        return this.suggestionsRepository.findByBuildingId(buildingId, userId);
    }

    async deleteSuggestion(id: string): Promise<void> {
        return this.suggestionsRepository.delete(id);
    }

    async voteSuggestion(data: CreateSuggestionVoteInput): Promise<void> {
        return this.suggestionsRepository.vote(data);
    }
}
