import { Request, Response, NextFunction } from 'express';
import { createAuthenticatedClient } from '@repo/supabase';
import { ServicersRepository } from '../repositories/servicers.repository.js';
import { ServicersService } from '../services/servicers.service.js';
import { CreateServicerInput } from '@repo/domain';

export class ServicersController {
    async createServicer(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('No authorization token provided');

            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);

            const servicerData: CreateServicerInput = req.body;
            const result = await service.createServicer(servicerData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAllServicers(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('No authorization token provided');

            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);

            const result = await service.getAllServicers();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async assignToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('No authorization token provided');

            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);

            const { servicerId, malfunctionId } = req.body;

            const { data: { user }, error } = await client.auth.getUser();
            if (error || !user) throw new Error('Unauthorized');

            const result = await service.assignToken(servicerId, malfunctionId, user.id);
            res.status(201).json({ token: result });
        } catch (error) {
            next(error);
        }
    }

    async verifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            if (!token) throw new Error('Token is required');

            const { supabaseAdmin } = await import('@repo/supabase');
            const repository = new ServicersRepository(supabaseAdmin);
            const service = new ServicersService(repository);

            const result = await service.verifyToken(token);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, status } = req.body;
            if (!token || !status) throw new Error('Token and status are required');

            const { supabaseAdmin } = await import('@repo/supabase');
            const repository = new ServicersRepository(supabaseAdmin);
            const service = new ServicersService(repository);

            await service.updateStatus(token, status);
            res.status(200).json({ message: 'Status updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getAllTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('No authorization token provided');

            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);

            const result = await service.getAllTokens();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async revokeToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('No authorization token provided');

            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);

            const { tokenId } = req.body;
            if (!tokenId) throw new Error('Token ID is required');

            await service.revokeToken(tokenId);
            res.status(200).json({ message: 'Token revoked successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const servicersController = new ServicersController();
