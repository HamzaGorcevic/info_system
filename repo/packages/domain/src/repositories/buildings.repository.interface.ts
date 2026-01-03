import { Database } from "@repo/types";

export interface IBuildiningRepository {
    findUnverifiedTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]>;
    getTenantData(userId: string): Promise<Database['public']['Tables']['tenants']['Row'] | null>;
    verifyTenant(userId: string, adminId: string): Promise<{ success: boolean }>;
}