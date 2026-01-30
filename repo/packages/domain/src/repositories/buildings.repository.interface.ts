import { Database } from "@repo/types";

export interface IBuildingRepository {
    findUnverifiedTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]>;
    findBuildingTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]>;

    findTenantByUserId(userId: string): Promise<Database['public']['Tables']['tenants']['Row'] | null>;
    countOwnersInApartment(buildingId: string, apartmentNumber: string): Promise<number>;
    updateTenant(tenantId: string, data: Database['public']['Tables']['tenants']['Update']): Promise<Database['public']['Tables']['tenants']['Row']>;

    findBuildingsByManagerId(userId: string): Promise<Database['public']['Tables']['buildings']['Row'][]>;
    findTenantById(id: string): Promise<Database['public']['Tables']['tenants']['Row'] | null>;
}