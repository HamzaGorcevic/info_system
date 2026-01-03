import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";
import { IServicerRepository } from "@repo/domain";

export class ServicersRepository implements IServicerRepository {
    constructor(private client: SupabaseClient) { }

    async create(data: Database['public']['Tables']['servicers']['Insert']): Promise<Database['public']['Tables']['servicers']['Row']> {
        const { data: result, error } = await this.client
            .from('servicers')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async findById(id: string): Promise<Database['public']['Tables']['servicers']['Row'] | null> {
        const { data, error } = await this.client
            .from('servicers')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async findAll(): Promise<Database['public']['Tables']['servicers']['Row'][]> {
        const { data: servicers, error } = await this.client
            .from('servicers')
            .select('*');

        if (error) throw new Error(error.message);
        if (!servicers || servicers.length === 0) return [];

        const servicerIds = servicers.map(s => s.id);
        const { data: ratings, error: ratingsError } = await this.client
            .from('ratings')
            .select('*')
            .in('servicer_id', servicerIds);

        if (ratingsError) throw new Error(ratingsError.message);

        return servicers.map(s => ({
            ...s,
            ratings: ratings?.filter(r => r.servicer_id === s.id) || []
        })) as any;
    }

    async createGuestToken(data: Database['public']['Tables']['guest_access_tokens']['Insert']): Promise<Database['public']['Tables']['guest_access_tokens']['Row']> {
        const { data: result, error } = await this.client
            .from('guest_access_tokens')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async getBuildingIdFromMalfunction(malfunctionId: string): Promise<string> {
        const { data: malfunction, error: malError } = await this.client
            .from('malfunctions')
            .select('tenant_id')
            .eq('id', malfunctionId)
            .single();

        if (malError || !malfunction) throw new Error('Malfunction not found');

        const { data: tenant, error: tenantError } = await this.client
            .from('tenants')
            .select('building_id')
            .eq('id', malfunction.tenant_id)
            .single();

        if (tenantError || !tenant) throw new Error('Tenant/Building not found');

        return tenant.building_id;
    }
    async validateGuestToken(token: string): Promise<any> {
        const { data, error } = await this.client
            .from('guest_access_tokens')
            .select('*, malfunctions(*)')
            .eq('token', token)
            .eq('is_active', true)
            .gt('expires_at', new Date().toISOString())
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async updateMalfunctionStatus(malfunctionId: string, status: string): Promise<void> {
        const { error } = await this.client
            .from('malfunctions')
            .update({ status })
            .eq('id', malfunctionId);

        if (error) throw new Error(error.message);
    }

    async assignServicerToMalfunction(malfunctionId: string, servicerId: string): Promise<void> {
        const { error } = await this.client
            .from('malfunctions')
            .update({ servicer_id: servicerId, status: 'assigned' })
            .eq('id', malfunctionId);

        if (error) throw new Error(error.message);
    }

    async getAllTokens(): Promise<any[]> {
        const { data, error } = await this.client
            .from('guest_access_tokens')
            .select('*, servicers(full_name), malfunctions(title, category)')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    async revokeToken(tokenId: string): Promise<void> {
        const { error } = await this.client
            .from('guest_access_tokens')
            .update({ is_active: false })
            .eq('id', tokenId);

        if (error) throw new Error(error.message);
    }
}
