import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";

export class DocumentsRepository {
    constructor(private client: SupabaseClient) { }

    async create(data: any): Promise<any> {
        const { data: result, error } = await this.client
            .from('documents')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async findByBuildingId(buildingId: string): Promise<any[]> {
        const { data, error } = await this.client
            .from('documents')
            .select('*')
            .eq('building_id', buildingId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('documents')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
