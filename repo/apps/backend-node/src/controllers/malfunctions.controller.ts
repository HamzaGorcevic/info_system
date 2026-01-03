import { Request, Response, NextFunction } from 'express';
import { malfunctionsService } from '../services/malfunctions.service.js';
import { RepositoryFactory } from '../factories/repository.factory.js';
import { CreateMalfunctionInput } from '@repo/domain';

export class MalfunctionsController {
    async reportMalfunction(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getMalfunctionsRepository(context);
            const storage = RepositoryFactory.getStorageService(context);

            const { tenant_id, reporter_id, title, description, category } = req.body;

            const malfunctionData: CreateMalfunctionInput = {
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

            const result = await malfunctionsService.reportMalfunction(repository, storage, malfunctionData, file);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getMalfunctions(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getMalfunctionsRepository(context);

            const { tenantId } = req.params;
            const result = await malfunctionsService.getTenantMalfunctions(repository, tenantId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAllMalfunctions(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getMalfunctionsRepository(context);

            const result = await malfunctionsService.getAllMalfunctions(repository);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async rateMalfunction(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const repository = RepositoryFactory.getMalfunctionsRepository(context);

            const { malfunction_id, servicer_id, rating_score, comment } = req.body;

            if (!context.currentUser) {
                throw new Error('Unauthorized');
            }

            const result = await malfunctionsService.rateMalfunction(repository, {
                malfunction_id,
                servicer_id,
                rating_score,
                comment,
                rated_by: context.currentUser.id
            });
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const malfunctionsController = new MalfunctionsController();
