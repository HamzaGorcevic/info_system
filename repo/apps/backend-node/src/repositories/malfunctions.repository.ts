import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";
import { IMalfunctionRepository } from "@repo/domain";

export class MalfunctionsRepository implements IMalfunctionRepository {
    constructor(private client: SupabaseClient) { }

    async create(data: Database['public']['Tables']['malfunctions']['Insert']): Promise<Database['public']['Tables']['malfunctions']['Row']> {
        const { data: result, error } = await this.client
            .from('malfunctions')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async findById(id: string): Promise<Database['public']['Tables']['malfunctions']['Row'] | null> {
        const { data, error } = await this.client
            .from('malfunctions')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    async findByTenantId(tenantId: string): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        const { data: malfunctions, error } = await this.client
            .from('malfunctions')
            .select('*')
            .eq('tenant_id', tenantId);

        if (error) throw new Error(error.message);
        if (!malfunctions || malfunctions.length === 0) return [];

        const malfunctionIds = malfunctions.map(m => m.id);
        const { data: ratings, error: ratingsError } = await this.client
            .from('ratings')
            .select('*')
            .in('malfunction_id', malfunctionIds);

        if (ratingsError) throw new Error(ratingsError.message);

        // 3. Attach ratings to malfunctions
        return malfunctions.map(m => ({
            ...m,
            ratings: ratings?.filter(r => r.malfunction_id === m.id) || []
        })) as any;
    }

    async findAll(): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        const { data, error } = await this.client
            .from('malfunctions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }



    async update(id: string, data: Database['public']['Tables']['malfunctions']['Update']): Promise<Database['public']['Tables']['malfunctions']['Row']> {
        const { data: result, error } = await this.client
            .from('malfunctions')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }

    async rate(data: Database['public']['Tables']['ratings']['Insert']): Promise<Database['public']['Tables']['ratings']['Row']> {
        const { data: result, error } = await this.client
            .from('ratings')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result;
    }
}
