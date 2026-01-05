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

        const { data: interventions, error: interventionsError } = await this.client
            .from('interventions')
            .select('id, malfunction_id')
            .in('malfunction_id', malfunctionIds);

        if (interventionsError) throw new Error(interventionsError.message);

        const interventionIds = interventions?.map(i => i.id) || [];
        let ratings: any[] = [];

        if (interventionIds.length > 0) {
            const { data: fetchedRatings, error: ratingsError } = await this.client
                .from('ratings')
                .select('*')
                .in('intervention_id', interventionIds);

            if (ratingsError) throw new Error(ratingsError.message);
            ratings = fetchedRatings || [];
        }

        // Attach ratings to malfunctions via interventions
        return malfunctions.map(m => {
            const mInterventions = interventions?.filter(i => i.malfunction_id === m.id) || [];
            const mInterventionIds = mInterventions.map(i => i.id);
            const mRatings = ratings.filter(r => mInterventionIds.includes(r.intervention_id));

            return {
                ...m,
                ratings: mRatings
            };
        }) as any;
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

    async findInterventionByMalfunctionAndServicer(malfunctionId: string, servicerId: string): Promise<any> {
        const { data, error } = await this.client
            .from('interventions')
            .select('id')
            .eq('malfunction_id', malfunctionId)
            .eq('servicer_id', servicerId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) return null; // Return null if not found
        return data;
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
