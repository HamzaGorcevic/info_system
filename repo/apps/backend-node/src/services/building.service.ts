import { IBuildingRepository, IUserRepository } from "@repo/domain";
import { Database } from "@repo/types";

export class BuildingService {

    async findUnverifiedTenants(
        buildingRepository: IBuildingRepository,
        buildingId: string
    ): Promise<Database['public']['Tables']['tenants']['Row'][]> {
        console.log('Fetching unverified tenants for building:', buildingId);

        const data = await buildingRepository.findUnverifiedTenants(buildingId);

        console.log(`Found ${data?.length || 0} unverified tenants for building ${buildingId}`);
        return data;
    }

    async verifyTenant(
        buildingRepository: IBuildingRepository,
        userRepository: IUserRepository,
        userId: string,
        adminId: string
    ): Promise<{ success: boolean }> {
        await userRepository.verifyUser(userId, adminId);

        const tenant = await buildingRepository.findTenantByUserId(userId);

        if (tenant) {
            const count = await buildingRepository.countOwnersInApartment(tenant.building_id, tenant.apartment_number);

            if (count === 0) {
                console.log(`Setting user ${userId} as owner of Apt ${tenant.apartment_number}`);
                await buildingRepository.updateTenant(tenant.id, { is_owner: true });
            }
        }

        return { success: true };
    }

    async getTenantData(
        buildingRepository: IBuildingRepository,
        userId: string
    ): Promise<Database['public']['Tables']['tenants']['Row'] | null> {
        const data = await buildingRepository.findTenantByUserId(userId);

        if (!data) {
            console.warn('No tenant data found for user:', userId);
        }

        return data;
    }
}

export const buildingService = new BuildingService();
