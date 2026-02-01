import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';
import { CreateServicerDto } from '@repo/domain';

export class ServicersController {
    async createServicer(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const servicersService = ServiceFactory.getServicersService(context);

        const servicerData: CreateServicerDto = {
            ...req.body,
            created_by: context.currentUser?.id
        };
        const result = await servicersService.createServicer(servicerData);
        res.status(201).json(result);
    }

    async getAllServicers(req: Request, res: Response, next: NextFunction) {
        const servicersService = ServiceFactory.getServicersService(req.context);

        const result = await servicersService.getAllServicers();
        res.status(200).json(result);
    }

    async assignToken(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const servicersService = ServiceFactory.getServicersService(context);

        const { servicerId, malfunctionId } = req.body;

        if (!context.currentUser) {
            throw new Error('Unauthorized');
        }

        const result = await servicersService.assignToken(servicerId, malfunctionId, context.currentUser.id);
        res.status(201).json({ token: result });
    }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const { token } = req.body;
        if (!token) throw new Error('Token is required');

        const servicersService = ServiceFactory.getServicersService(req.context);

        const result = await servicersService.verifyToken(token);
        res.status(200).json(result);
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        const { token, status } = req.body;
        if (!token || !status) throw new Error('Token and status are required');

        const servicersService = ServiceFactory.getServicersService(req.context);

        await servicersService.updateStatus(token, status);
        res.status(200).json({ message: 'Status updated successfully' });
    }

    async getAllTokens(req: Request, res: Response, next: NextFunction) {
        const servicersService = ServiceFactory.getServicersService(req.context);

        const result = await servicersService.getAllTokens();
        res.status(200).json(result);
    }

    async revokeToken(req: Request, res: Response, next: NextFunction) {
        const servicersService = ServiceFactory.getServicersService(req.context);

        const { tokenId } = req.body;
        if (!tokenId) throw new Error('Token ID is required');

        await servicersService.revokeToken(tokenId);
        res.status(200).json({ message: 'Token revoked successfully' });
    }
}

export const servicersController = new ServicersController();
