import { Request, Response, NextFunction } from 'express';
import { buildingService } from '../services/building.service.js';
import { RepositoryFactory } from '../factories/repository.factory.js';

export class BuildingController {
    async findUnverifiedTenants(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const buildingRepository = RepositoryFactory.getBuildingRepository(context);

            const { buildingId } = req.params;
            const result = await buildingService.findUnverifiedTenants(buildingRepository, buildingId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async verifyTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const buildingRepository = RepositoryFactory.getBuildingRepository(context);
            const userRepository = RepositoryFactory.getUserRepository(context);

            const { userId } = req.params;
            const { adminId } = req.body;
            const result = await buildingService.verifyTenant(buildingRepository, userRepository, userId, adminId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTenantData(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const buildingRepository = RepositoryFactory.getBuildingRepository(context);

            const { userId } = req.params;
            const result = await buildingService.getTenantData(buildingRepository, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

}

export const buildingController = new BuildingController();
