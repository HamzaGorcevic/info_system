import { IBuildingRepository, IUserRepository, Building, Tenant } from "@repo/domain";

export class BuildingService {
    constructor(
        private buildingRepository: IBuildingRepository,
        private userRepository: IUserRepository
    ) { }

    async findUnverifiedTenants(
        buildingId: string
    ): Promise<Tenant[]> {
        return this.buildingRepository.findUnverifiedTenants(buildingId);
    }

    async verifyTenant(
        userId: string,
        adminId: string
    ): Promise<{ success: boolean }> {
        await this.userRepository.verifyUser(userId, adminId);

        const tenant = await this.buildingRepository.findTenantByUserId(userId);

        if (tenant) {
            const count = await this.buildingRepository.countOwnersInApartment(tenant.building_id, tenant.apartment_number);

            if (count === 0) {
                await this.buildingRepository.updateTenant(tenant.id, { is_owner: true });
            }
        }

        return { success: true };
    }

    async getTenantData(
        userId: string
    ): Promise<Tenant | null> {
        return this.buildingRepository.findTenantByUserId(userId);
    }

    async getBuildingTenants(buildingId: string): Promise<Tenant[]> {
        return this.buildingRepository.findBuildingTenants(buildingId);
    }

    async findBuildingsByManagerId(userId: string): Promise<Building[]> {
        return this.buildingRepository.findBuildingsByManagerId(userId);
    }
}
