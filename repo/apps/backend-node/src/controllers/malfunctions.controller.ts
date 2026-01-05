import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';
import { CreateMalfunctionInput } from '@repo/domain';

export class MalfunctionsController {
    async reportMalfunction(req: Request, res: Response, next: NextFunction) {
        const malfunctionsService = ServiceFactory.getMalfunctionsService(req.context);

        const { tenant_id, title, description, category } = req.body;

        if (!req.context.currentUser) {
            throw new Error('Unauthorized');
        }

        const malfunctionData: CreateMalfunctionInput = {
            tenant_id,
            reporter_id: req.context.currentUser.id,
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

        const result = await malfunctionsService.reportMalfunction(malfunctionData, file);
        res.status(201).json(result);
    }

    async getMalfunctions(req: Request, res: Response, next: NextFunction) {
        const malfunctionsService = ServiceFactory.getMalfunctionsService(req.context);

        const { tenantId } = req.params;
        const result = await malfunctionsService.getTenantMalfunctions(tenantId);
        res.status(200).json(result);
    }

    async getAllMalfunctions(req: Request, res: Response, next: NextFunction) {
        const malfunctionsService = ServiceFactory.getMalfunctionsService(req.context);

        const result = await malfunctionsService.getAllMalfunctions();
        res.status(200).json(result);
    }

    async rateMalfunction(req: Request, res: Response, next: NextFunction) {
        const context = req.context;
        const malfunctionsService = ServiceFactory.getMalfunctionsService(context);

        const { malfunction_id, servicer_id, rating_score, comment } = req.body;

        if (!context.currentUser) {
            throw new Error('Unauthorized');
        }

        const result = await malfunctionsService.rateMalfunction({
            malfunction_id,
            servicer_id,
            rating_score,
            comment,
            rated_by: context.currentUser.id
        });
        res.status(201).json(result);
    }
}

export const malfunctionsController = new MalfunctionsController();
