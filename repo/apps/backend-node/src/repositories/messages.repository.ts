import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";
import { IMessageRepository } from "@repo/domain";

export class MessagesRepository implements IMessageRepository {
    constructor(private client: SupabaseClient) { }

    async create(data: Database['public']['Tables']['messages']['Insert']): Promise<Database['public']['Tables']['messages']['Row']> {
        const { data: result, error } = await this.client
            .from('messages')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async findById(id: string): Promise<Database['public']['Tables']['messages']['Row'] | null> {
        const { data, error } = await this.client
            .from('messages')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async findByBuildingId(buildingId: string): Promise<Database['public']['Tables']['messages']['Row'][]> {
        const { data, error } = await this.client
            .from('messages')
            .select('*')
            .eq('building_id', buildingId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
