import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";
import { IEventRepository } from "@repo/domain";

export class EventsRepository implements IEventRepository {
    constructor(private client: SupabaseClient) { }

    async create(data: Database['public']['Tables']['events']['Insert']): Promise<Database['public']['Tables']['events']['Row']> {
        const { data: result, error } = await this.client
            .from('events')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async findById(id: string): Promise<Database['public']['Tables']['events']['Row'] | null> {
        const { data, error } = await this.client
            .from('events')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async findByBuildingId(buildingId: string): Promise<Database['public']['Tables']['events']['Row'][]> {
        const { data, error } = await this.client
            .from('events')
            .select('*')
            .eq('building_id', buildingId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async update(id: string, data: Database['public']['Tables']['events']['Update']): Promise<Database['public']['Tables']['events']['Row']> {
        const { data: result, error } = await this.client
            .from('events')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
