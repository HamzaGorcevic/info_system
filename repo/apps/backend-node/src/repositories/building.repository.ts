import { supabaseAdmin } from "@repo/supabase";
import { Database } from "@repo/types";
export class BuildingRepository {
    async findUnverifiedTenants(buildingId: string): Promise<Database['public']['Tables']['tenants']['Row'][]> {
        const { data, error } = await supabaseAdmin
            .from('tenants')
            .select('*, users!inner(*), buildings(*)')
            .eq('building_id', buildingId)
            .eq('users.is_verified', false);

        if (error) throw new Error(error.message);
        return data;
    }

    async findTenantByUserId(userId: string): Promise<Database['public']['Tables']['tenants']['Row'] | null> {
        const { data, error } = await supabaseAdmin
            .from('tenants')
            .select('*, buildings(*)')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async countOwnersInApartment(buildingId: string, apartmentNumber: string): Promise<number> {
        const { count, error } = await supabaseAdmin
            .from('tenants')
            .select('*', { count: 'exact', head: true })
            .eq('building_id', buildingId)
            .eq('apartment_number', apartmentNumber)
            .eq('is_owner', true);

        if (error) throw new Error(error.message);
        return count || 0;
    }

    async updateTenant(id: string, data: any) {
        const { error } = await supabaseAdmin
            .from('tenants')
            .update(data)
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
