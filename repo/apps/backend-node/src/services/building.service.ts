import { IBuildiningRepository } from "packages/domain/src/repositories/buildings.repository.interface.js";
import { BuildingRepository } from "../repositories/building.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { IUserRepository } from "@repo/domain";
import { Database } from "@repo/types";

export class BuildingService implements IBuildiningRepository {
    constructor(
        private buildingRepository: BuildingRepository = new BuildingRepository(),
        private userRepository: IUserRepository = new UserRepository()
    ) { }

    async findUnverifiedTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]> {
        console.log('Fetching unverified tenants for building:', buildingId);

        const data = await this.buildingRepository.findUnverifiedTenants(buildingId);

        console.log(`Found ${data?.length || 0} unverified tenants for building ${buildingId}`);
        return data;
    }

    async verifyTenant(userId: string, adminId: string): Promise<{ success: boolean }> {
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

    async getTenantData(userId: string): Promise<Database['public']['Tables']['tenants']['Row'] | null> {
        const data = await this.buildingRepository.findTenantByUserId(userId);

        if (!data) {
            console.warn('No tenant data found for user:', userId);
        }

        return data;
    }
}

export const buildingService = new BuildingService();
