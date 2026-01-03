import { BuildingService } from '../services/building.service.js';
export class BuildingController {
    buildingService;
    constructor(buildingService = new BuildingService()) {
        this.buildingService = buildingService;
        this.findUnverifiedTenants = this.findUnverifiedTenants.bind(this);
        this.verifyTenant = this.verifyTenant.bind(this);
        this.getTenantData = this.getTenantData.bind(this);
    }
    async findUnverifiedTenants(req, res, next) {
        try {
            const { buildingId } = req.params;
            const result = await this.buildingService.findUnverifiedTenants(buildingId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async verifyTenant(req, res, next) {
        try {
            const { userId } = req.params;
            const { adminId } = req.body;
            const result = await this.buildingService.verifyTenant(userId, adminId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getTenantData(req, res, next) {
        try {
            const { userId } = req.params;
            const result = await this.buildingService.getTenantData(userId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
export const buildingController = new BuildingController();
