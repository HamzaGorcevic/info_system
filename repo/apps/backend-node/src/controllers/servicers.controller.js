import { createAuthenticatedClient } from '@repo/supabase';
import { ServicersRepository } from '../repositories/servicers.repository.js';
import { ServicersService } from '../services/servicers.service.js';
export class ServicersController {
    async createServicer(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('No authorization token provided');
            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);
            const servicerData = req.body;
            const result = await service.createServicer(servicerData);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllServicers(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('No authorization token provided');
            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);
            const result = await service.getAllServicers();
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async assignToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('No authorization token provided');
            const client = createAuthenticatedClient(token);
            const repository = new ServicersRepository(client);
            const service = new ServicersService(repository);
            const { servicerId, malfunctionId, buildingId } = req.body;
            // We need the user ID of the admin granting the token.
            // Since we have the client, we can get the user.
            const { data: { user }, error } = await client.auth.getUser();
            if (error || !user)
                throw new Error('Unauthorized');
            const result = await service.assignToken(servicerId, malfunctionId, buildingId, user.id);
            res.status(201).json({ token: result });
        }
        catch (error) {
            next(error);
        }
    }
}
export const servicersController = new ServicersController();
