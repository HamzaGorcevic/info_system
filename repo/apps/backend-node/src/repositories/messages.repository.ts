import { SupabaseClient } from "@repo/supabase";
import { IMessageRepository, Message, CreateMessageDto } from "@repo/domain";
import { Database } from "@repo/types";

export class MessagesRepository implements IMessageRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async create(data: CreateMessageDto): Promise<Message> {
        const { data: result, error } = await this.client
            .from('messages')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Message;
    }

    async findById(id: string): Promise<Message | null> {
        const { data, error } = await this.client
            .from('messages')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as Message | null;
    }

    async findByBuildingId(building_id: string): Promise<Message[]> {
        const { data, error } = await this.client
            .from('messages')
            .select('*')
            .eq('building_id', building_id)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Message[];
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
