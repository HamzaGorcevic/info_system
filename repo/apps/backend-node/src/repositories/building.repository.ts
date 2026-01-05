import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";
import { IBuildingRepository } from "@repo/domain";

export class BuildingRepository implements IBuildingRepository {
    constructor(private client: SupabaseClient) { }

    async findUnverifiedTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*, users!inner(*), buildings(*)')
            .eq('building_id', buildingId)
            .eq('users.is_verified', false);

        if (error) throw new Error(error.message);
        return data || [];
    }

    async findTenantByUserId(userId: string): Promise<Database['public']['Tables']['tenants']['Row'] | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*, buildings(*)')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async countOwnersInApartment(buildingId: string, apartmentNumber: string): Promise<number> {
        const { count, error } = await this.client
            .from('tenants')
            .select('*', { count: 'exact', head: true })
            .eq('building_id', buildingId)
            .eq('apartment_number', apartmentNumber)
            .eq('is_owner', true);

        if (error) throw new Error(error.message);
        return count || 0;
    }

    async updateTenant(id: string, data: any) {
        const { data: updated, error } = await this.client
            .from('tenants')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updated;
    }



    async findBuildingsByManagerId(userId: string): Promise<any[]> {
        const { data, error } = await this.client
            .from('building_managers')
            .select('building_id, buildings(*, tenants(id))')
            .eq('user_id', userId);

        if (error) throw new Error(error.message);

        return data?.map((item: any) => ({
            ...item.buildings,
            tenants_count: item.buildings.tenants?.length || 0
        })) || [];
    }
}
