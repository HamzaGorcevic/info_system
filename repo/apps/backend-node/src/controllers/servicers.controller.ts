import { Request, Response, NextFunction } from 'express';
import { servicersService } from '../services/servicers.service.js';
import { RepositoryFactory } from '../factories/repository.factory.js';
import { CreateServicerInput } from '@repo/domain';

export class ServicersController {
    async createServicer(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            const servicerData: CreateServicerInput = {
                ...req.body,
                created_by: context.currentUser?.id
            };
            const result = await servicersService.createServicer(repository, servicerData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAllServicers(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            const result = await servicersService.getAllServicers(repository);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async assignToken(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            const { servicerId, malfunctionId } = req.body;

            if (!context.currentUser) {
                throw new Error('Unauthorized');
            }

            const result = await servicersService.assignToken(repository, servicerId, malfunctionId, context.currentUser.id);
            res.status(201).json({ token: result });
        } catch (error) {
            next(error);
        }
    }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            if (!token) throw new Error('Token is required');

            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            const result = await servicersService.verifyToken(repository, token);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, status } = req.body;
            if (!token || !status) throw new Error('Token and status are required');

            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            await servicersService.updateStatus(repository, token, status);
            res.status(200).json({ message: 'Status updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getAllTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            const result = await servicersService.getAllTokens(repository);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async revokeToken(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getServicersRepository(context);

            const { tokenId } = req.body;
            if (!tokenId) throw new Error('Token ID is required');

            await servicersService.revokeToken(repository, tokenId);
            res.status(200).json({ message: 'Token revoked successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const servicersController = new ServicersController();
