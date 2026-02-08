import { SupabaseClient } from "@repo/supabase";
import { IBuildingRepository, Building, Tenant, UpdateTenantDto, CreateBuildingDto } from "@repo/domain";
import { Database } from "@repo/types";

export class BuildingRepository implements IBuildingRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async findUnverifiedTenants(buildingId: string): Promise<Tenant[]> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*, users!inner(*), buildings(*)')
            .eq('building_id', buildingId)
            .eq('users.is_verified', false);

        if (error) throw new Error(error.message);
        return (data || []) as unknown as Tenant[];
    }

    async findBuildingTenants(buildingId: string): Promise<Tenant[]> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*, users!inner(*)')
            .eq('building_id', buildingId);

        if (error) throw new Error(error.message);
        return (data || []) as unknown as Tenant[];
    }

    async findTenantByUserId(userId: string): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*, buildings(*)')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as unknown as Tenant | null;
    }

    async countOwnersInApartment(buildingId: string, apartmentNumber: number): Promise<number> {
        const { count, error } = await this.client
            .from('tenants')
            .select('*', { count: 'exact', head: true })
            .eq('building_id', buildingId)
            .eq('apartment_number', apartmentNumber)
            .eq('is_owner', true);

        if (error) throw new Error(error.message);
        return count || 0;
    }

    async updateTenant(id: string, data: UpdateTenantDto): Promise<Tenant> {
        const { data: updated, error } = await this.client
            .from('tenants')
            .update(data as any)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return updated as unknown as Tenant;
    }

    async findBuildingsByManagerId(userId: string): Promise<Building[]> {
        const { data, error } = await this.client
            .from('building_managers')
            .select('building_id, buildings(*, tenants(id))')
            .eq('user_id', userId);

        if (error) throw new Error(error.message);

        return (data?.map((item: any) => ({
            ...item.buildings,
            tenants_count: item.buildings.tenants?.length || 0
        })) || []) as unknown as Building[];
    }

    async findTenantById(id: string): Promise<Tenant | null> {
        const { data, error } = await this.client
            .from('tenants')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw new Error(error.message);
        return data as unknown as Tenant | null;
    }

    async create(building: CreateBuildingDto): Promise<Building> {
        const { data, error } = await this.client
            .from('buildings')
            .insert(building)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as unknown as Building;
    }

    async addManager(buildingId: string, userId: string): Promise<void> {
        const { error } = await this.client
            .from('building_managers')
            .insert({
                user_id: userId,
                building_id: buildingId
            });

        if (error) throw new Error(error.message);
    }

    async findById(id: string): Promise<Building | null> {
        const { data, error } = await this.client
            .from('buildings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as unknown as Building;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('buildings')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
