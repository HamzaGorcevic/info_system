import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';
import { CreateEventInput, UpdateEventInput } from '@repo/domain';

export class EventsController {
    async createEvent(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const eventsService = ServiceFactory.getEventsService(context);

        const eventData: CreateEventInput & { created_by: string } = {
            ...req.body,
            created_by: context.currentUser?.id
        };
        const result = await eventsService.createEvent(eventData);
        res.status(201).json(result);
    }

    async getEventsByBuilding(req: Request, res: Response, next: NextFunction) {
        const { buildingId } = req.params;
        const eventsService = ServiceFactory.getEventsService(req.context);

        const result = await eventsService.getEventsByBuilding(buildingId);
        res.status(200).json(result);
    }

    async updateEvent(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const eventData: UpdateEventInput = req.body;
        const eventsService = ServiceFactory.getEventsService(req.context);

        const result = await eventsService.updateEvent(id, eventData);
        res.status(200).json(result);
    }

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const eventsService = ServiceFactory.getEventsService(req.context);

        await eventsService.deleteEvent(id);
        res.status(204).send();
    }
}

export const eventsController = new EventsController();
