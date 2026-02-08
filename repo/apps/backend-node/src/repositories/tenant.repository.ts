import { SupabaseClient } from "@repo/supabase";
import { ITenantRepository, Tenant, CreateTenantDto } from "@repo/domain";
import { Database } from "@repo/types";

export class TenantRepository implements ITenantRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async create(tenant: CreateTenantDto): Promise<Tenant> {
        const { data, error } = await this.client
            .from('tenants')
            .insert(tenant)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as unknown as Tenant;
    }

    async findByApartment(buildingId: string, apartmentNumber: number): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .eq('building_id', buildingId)
            .eq('apartment_number', apartmentNumber)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as unknown as Tenant | null;
    }

    async findMaxTenantNumber(buildingId: string): Promise<number> {
        const { data, error } = await this.client
            .from('tenants')
            .select('tenant_number')
            .eq('building_id', buildingId)
            .order('tenant_number', { ascending: false })
            .limit(1)
            .maybeSingle(); // Use maybeSingle to handle no rows (returns null data)

        if (error && error.code !== 'PGRST116') return 0; // Or throw, but 0 is safe default if none exists? 
        // Actually error is null if no rows with maybeSingle usually, or data is null.

        return data?.tenant_number || 0;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('tenants')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
