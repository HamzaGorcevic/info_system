import { Request, Response, NextFunction } from 'express';
import { BuildingService } from '../services/building.service.js';

export class BuildingController {
    constructor(
        private buildingService: BuildingService = new BuildingService()
    ) {
        this.findUnverifiedTenants = this.findUnverifiedTenants.bind(this);
        this.verifyTenant = this.verifyTenant.bind(this);
        this.getTenantData = this.getTenantData.bind(this);
    }
    async findUnverifiedTenants(req: Request, res: Response, next: NextFunction) {
        try {
            const { buildingId } = req.params;
            const result = await this.buildingService.findUnverifiedTenants(buildingId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async verifyTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { adminId } = req.body;
            const result = await this.buildingService.verifyTenant(userId, adminId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTenantData(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const result = await this.buildingService.getTenantData(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

}

export const buildingController = new BuildingController();
