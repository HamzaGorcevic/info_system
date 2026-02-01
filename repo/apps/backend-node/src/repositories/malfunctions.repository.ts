import { SupabaseClient } from "@repo/supabase";
import { IMalfunctionRepository, Malfunction, CreateMalfunctionDto, Rating } from "@repo/domain";
import { Database } from "@repo/types";

export class MalfunctionsRepository implements IMalfunctionRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async create(data: CreateMalfunctionDto): Promise<Malfunction> {
        const { data: result, error } = await this.client
            .from('malfunctions')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Malfunction;
    }

    async findById(id: string): Promise<Malfunction | null> {
        const { data, error } = await this.client
            .from('malfunctions')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as Malfunction | null;
    }

    async findByTenantId(tenantId: string): Promise<Malfunction[]> {
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
        }) as Malfunction[];
    }

    async findAll(): Promise<Malfunction[]> {
        const { data, error } = await this.client
            .from('malfunctions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Malfunction[];
    }

    async update(id: string, data: Partial<CreateMalfunctionDto>): Promise<Malfunction> {
        const { data: result, error } = await this.client
            .from('malfunctions')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Malfunction;
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

    async rate(data: Rating): Promise<Rating> {
        const { data: result, error } = await this.client
            .from('ratings')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Rating;
    }
}
