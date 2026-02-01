import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';
import { CreateMessageDto } from '@repo/domain';

export class MessagesController {
    async createMessage(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const messagesService = ServiceFactory.getMessagesService(context);

        const messageData: CreateMessageDto = {
            ...req.body,
            posted_by: context.currentUser?.id
        };
        const result = await messagesService.createMessage(messageData);
        res.status(201).json(result);
    }

    async getMessagesByBuilding(req: Request, res: Response, next: NextFunction) {
        const { buildingId } = req.params;
        const messagesService = ServiceFactory.getMessagesService(req.context);

        const result = await messagesService.getMessagesByBuilding(buildingId);
        res.status(200).json(result);
    }

    async deleteMessage(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const messagesService = ServiceFactory.getMessagesService(req.context);

        await messagesService.deleteMessage(id);
        res.status(204).send();
    }
}

export const messagesController = new MessagesController();
