import { supabaseAdmin } from "@repo/supabase/admin";
export class BuildingService {
    async getUnverifiedTenants(buildingId: string) {
        console.log('Fetching unverified tenants for building:', buildingId);

        const { data, error } = await supabaseAdmin
            .from('tenants')
            .select('*, users!inner(*), buildings(*)')
            .eq('building_id', buildingId)
            .eq('users.is_verified', false);

        if (error) {
            console.error('Supabase Error in getUnverifiedTenants:', error);
            throw new Error(error.message);
        }

        console.log(`Found ${data?.length || 0} unverified tenants for building ${buildingId}`);
        return data;
    }

    async verifyTenant(userId: string, adminId: string) {
        const { error } = await supabaseAdmin
            .from('users')
            .update({
                is_verified: true,
                verified_by: adminId,
                verified_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            throw new Error(error.message);
        }

        // Check if we should make them owner (First verified tenant in the apartment)
        const { data: tenant } = await supabaseAdmin
            .from('tenants')
            .select('id, building_id, apartment_number')
            .eq('user_id', userId)
            .maybeSingle();

        if (tenant) {
            // Check for existing owners in this apartment
            const { count } = await supabaseAdmin
                .from('tenants')
                .select('*', { count: 'exact', head: true })
                .eq('building_id', tenant.building_id)
                .eq('apartment_number', tenant.apartment_number)
                .eq('is_owner', true);

            // If no owner exists for this apartment, make this user the owner
            if (count === 0) {
                console.log(`Setting user ${userId} as owner of Apt ${tenant.apartment_number}`);
                await supabaseAdmin
                    .from('tenants')
                    .update({ is_owner: true })
                    .eq('id', tenant.id);
            }
        }

        return { success: true };
    }

    async getTenantData(userId: string) {
        const { data, error } = await supabaseAdmin
            .from('tenants')
            .select('*, buildings(*)')
            .eq('user_id', userId)
            .maybeSingle();
        if (error) {
            console.error('Supabase Error in getTenantData:', error);
            throw new Error(error.message);
        }

        if (!data) {
            console.warn('No tenant data found for user:', userId);
        }

        return data;
    }
}

export const buildingService = new BuildingService();
