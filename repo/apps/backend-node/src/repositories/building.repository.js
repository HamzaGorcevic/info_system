import { supabaseAdmin } from "@repo/supabase";
export class BuildingRepository {
    async findUnverifiedTenants(buildingId) {
        const { data, error } = await supabaseAdmin
            .from('tenants')
            .select('*, users!inner(*), buildings(*)')
            .eq('building_id', buildingId)
            .eq('users.is_verified', false);
        if (error)
            throw new Error(error.message);
        return data;
    }
    async findTenantByUserId(userId) {
        const { data, error } = await supabaseAdmin
            .from('tenants')
            .select('*, buildings(*)')
            .eq('user_id', userId)
            .maybeSingle();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async countOwnersInApartment(buildingId, apartmentNumber) {
        const { count, error } = await supabaseAdmin
            .from('tenants')
            .select('*', { count: 'exact', head: true })
            .eq('building_id', buildingId)
            .eq('apartment_number', apartmentNumber)
            .eq('is_owner', true);
        if (error)
            throw new Error(error.message);
        return count || 0;
    }
    async updateTenant(id, data) {
        const { error } = await supabaseAdmin
            .from('tenants')
            .update(data)
            .eq('id', id);
        if (error)
            throw new Error(error.message);
    }
}
