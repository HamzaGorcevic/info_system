import { ISuggestionRepository, Suggestion, SuggestionWithVote, CreateSuggestionDto, CreateSuggestionVoteDto } from "@repo/domain";

export class SuggestionsService {
    constructor(
        private suggestionsRepository: ISuggestionRepository
    ) { }

    async createSuggestion(
        data: CreateSuggestionDto
    ): Promise<Suggestion> {
        return this.suggestionsRepository.create(data);
    }

    async getSuggestionsByBuilding(buildingId: string, userId: string): Promise<SuggestionWithVote[]> {
        return this.suggestionsRepository.findByBuildingId(buildingId, userId);
    }

    async deleteSuggestion(id: string): Promise<void> {
        return this.suggestionsRepository.delete(id);
    }

    async voteSuggestion(data: CreateSuggestionVoteDto): Promise<void> {
        return this.suggestionsRepository.vote(data);
    }
}
