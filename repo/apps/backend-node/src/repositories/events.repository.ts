import { SupabaseClient } from "@repo/supabase";
import { IEventRepository, Event, CreateEventDto, UpdateEventDto } from "@repo/domain";
import { Database } from "@repo/types";

export class EventsRepository implements IEventRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async create(data: CreateEventDto): Promise<Event> {
        const { data: result, error } = await this.client
            .from('events')
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Event;
    }

    async findById(id: string): Promise<Event | null> {
        const { data, error } = await this.client
            .from('events')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data as Event | null;
    }

    async findByBuildingId(building_id: string): Promise<Event[]> {
        const { data, error } = await this.client
            .from('events')
            .select('*')
            .eq('building_id', building_id)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return (data || []) as Event[];
    }

    async update(id: string, data: UpdateEventDto): Promise<Event> {
        const { data: result, error } = await this.client
            .from('events')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return result as Event;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.client
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw new Error(error.message);
    }
}
