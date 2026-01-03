import { BuildingRepository } from "../repositories/building.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
export class BuildingService {
    buildingRepository;
    userRepository;
    constructor(buildingRepository = new BuildingRepository(), userRepository = new UserRepository()) {
        this.buildingRepository = buildingRepository;
        this.userRepository = userRepository;
    }
    async findUnverifiedTenants(buildingId) {
        console.log('Fetching unverified tenants for building:', buildingId);
        const data = await this.buildingRepository.findUnverifiedTenants(buildingId);
        console.log(`Found ${data?.length || 0} unverified tenants for building ${buildingId}`);
        return data;
    }
    async verifyTenant(userId, adminId) {
        await this.userRepository.verifyUser(userId, adminId);
        const tenant = await this.buildingRepository.findTenantByUserId(userId);
        if (tenant) {
            const count = await this.buildingRepository.countOwnersInApartment(tenant.building_id, tenant.apartment_number);
            if (count === 0) {
                console.log(`Setting user ${userId} as owner of Apt ${tenant.apartment_number}`);
                await this.buildingRepository.updateTenant(tenant.id, { is_owner: true });
            }
        }
        return { success: true };
    }
    async getTenantData(userId) {
        const data = await this.buildingRepository.findTenantByUserId(userId);
        if (!data) {
            console.warn('No tenant data found for user:', userId);
        }
        return data;
    }
}
export const buildingService = new BuildingService();
