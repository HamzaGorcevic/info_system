import { Request, Response, NextFunction } from 'express';
import { buildingService } from '../services/building.service.js';

export class BuildingController {
    async getUnverifiedTenants(req: Request, res: Response, next: NextFunction) {
        try {
            const { buildingId } = req.params;
            const result = await buildingService.getUnverifiedTenants(buildingId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async verifyTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { adminId } = req.body;
            const result = await buildingService.verifyTenant(userId, adminId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTenantData(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const result = await buildingService.getTenantData(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

}

export const buildingController = new BuildingController();
