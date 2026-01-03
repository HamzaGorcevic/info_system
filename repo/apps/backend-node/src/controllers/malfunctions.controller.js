import { createAuthenticatedClient } from '@repo/supabase';
import { MalfunctionsRepository } from '../repositories/malfunctions.repository.js';
import { MalfunctionsService } from '../services/malfunctions.service.js';
import { SupabaseStorageService } from '../services/storage.service.js';
export class MalfunctionsController {
    async reportMalfunction(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('No authorization token provided');
            const client = createAuthenticatedClient(token);
            const repository = new MalfunctionsRepository(client);
            const storage = new SupabaseStorageService(client);
            const service = new MalfunctionsService(repository, storage);
            const { tenant_id, reporter_id, title, description, category } = req.body;
            const malfunctionData = {
                tenant_id,
                reporter_id,
                title,
                description,
                category,
                image_url: null
            };
            const file = req.file ? {
                buffer: req.file.buffer,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname
            } : undefined;
            const result = await service.reportMalfunction(malfunctionData, file);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getMalfunctions(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token)
                throw new Error('No authorization token provided');
            const client = createAuthenticatedClient(token);
            const repository = new MalfunctionsRepository(client);
            const storage = new SupabaseStorageService(client);
            const service = new MalfunctionsService(repository, storage);
            const { tenantId } = req.params;
            const result = await service.getTenantMalfunctions(tenantId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
export const malfunctionsController = new MalfunctionsController();
