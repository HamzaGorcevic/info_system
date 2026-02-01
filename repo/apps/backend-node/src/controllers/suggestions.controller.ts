import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';
import { CreateSuggestionDto, CreateSuggestionVoteDto } from '@repo/domain';

export class SuggestionsController {
    async createSuggestion(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const suggestionsService = ServiceFactory.getSuggestionsService(context);

        const suggestionData: CreateSuggestionDto = {
            ...req.body,
            created_by: context.currentUser?.id
        };
        const result = await suggestionsService.createSuggestion(suggestionData);
        res.status(201).json(result);
    }

    async getSuggestionsByBuilding(req: Request, res: Response, next: NextFunction) {
        const { buildingId } = req.params;
        const context = req.context;
        const suggestionsService = ServiceFactory.getSuggestionsService(context);

        const result = await suggestionsService.getSuggestionsByBuilding(buildingId, context.currentUser?.id!);
        res.status(200).json(result);
    }

    async deleteSuggestion(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const suggestionsService = ServiceFactory.getSuggestionsService(req.context);

        await suggestionsService.deleteSuggestion(id);
        res.status(204).send();
    }

    async voteSuggestion(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const suggestionsService = ServiceFactory.getSuggestionsService(context);

        const voteData: CreateSuggestionVoteDto = {
            ...req.body,
            voted_by: context.currentUser?.id
        };
        await suggestionsService.voteSuggestion(voteData);
        res.status(200).send();
    }
}

export const suggestionsController = new SuggestionsController();
