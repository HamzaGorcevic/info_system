import { IBuildingRepository, IUserRepository } from "@repo/domain";
import { Database } from "@repo/types";

export class BuildingService {
    constructor(
        private buildingRepository: IBuildingRepository,
        private userRepository?: IUserRepository
    ) { }

    async findUnverifiedTenants(
        buildingId: string
    ): Promise<Database['public']['Tables']['tenants']['Row'][]> {
        const data = await this.buildingRepository.findUnverifiedTenants(buildingId);
        return data;
    }

    async verifyTenant(
        userId: string,
        adminId: string
    ): Promise<{ success: boolean }> {
        if (!this.userRepository) {
            throw new Error("UserRepository is required for verifyTenant");
        }

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
    ): Promise<Database['public']['Tables']['tenants']['Row'] | null> {
        const data = await this.buildingRepository.findTenantByUserId(userId);

        if (!data) {
            return null;
        }

        return data;
    }

    async getBuildingTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]> {
        return this.buildingRepository.findBuildingTenants(buildingId);
    }
}
