import { SupabaseClient } from "@repo/supabase";
import { IDocumentRepository, Document, CreateDocumentDto } from "@repo/domain";
import { Database } from "@repo/types";

export class DocumentsRepository implements IDocumentRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async create(data: CreateDocumentDto): Promise<Document> {
        const { data: result, error } = await this.client
            .from('documents')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Document;
    }

    async findByBuildingId(buildingId: string): Promise<Document[]> {
        const { data, error } = await this.client
            .from('documents')
            .select('*')
            .eq('building_id', buildingId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Document[];
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('documents')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
