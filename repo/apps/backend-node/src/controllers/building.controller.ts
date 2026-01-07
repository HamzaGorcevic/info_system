import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';

export class BuildingController {
    async findUnverifiedTenants(req: Request, res: Response, next: NextFunction) {
        const buildingService = ServiceFactory.getBuildingService(req.context);

        const { buildingId } = req.params;
        const result = await buildingService.findUnverifiedTenants(buildingId);
        res.status(200).json(result);
    }

    async verifyTenant(req: Request, res: Response, next: NextFunction) {
        const buildingService = ServiceFactory.getBuildingService(req.context);

        const { userId } = req.params;
        const { adminId } = req.body;
        const result = await buildingService.verifyTenant(userId, adminId);
        res.status(200).json(result);
    }

    async getTenantData(req: Request, res: Response, next: NextFunction) {
        const buildingService = ServiceFactory.getBuildingService(req.context);

        const { userId } = req.params;
        const result = await buildingService.getTenantData(userId);
        res.status(200).json(result);
    }

    async getBuildingTenants(req: Request, res: Response, next: NextFunction) {
        const buildingService = ServiceFactory.getBuildingService(req.context);
        const { buildingId } = req.params;
        const result = await buildingService.getBuildingTenants(buildingId);
        res.status(200).json(result);
    }
}

export const buildingController = new BuildingController();
