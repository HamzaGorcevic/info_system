import { IEventRepository, CreateEventInput, UpdateEventInput } from "@repo/domain";
import { Database } from "@repo/types";

export class EventsService {
    constructor(
        private eventsRepository: IEventRepository
    ) { }

    async createEvent(
        data: CreateEventInput & { created_by: string }
    ): Promise<Database['public']['Tables']['events']['Row']> {
        return this.eventsRepository.create(data);
    }

    async getEventsByBuilding(buildingId: string): Promise<Database['public']['Tables']['events']['Row'][]> {
        return this.eventsRepository.findByBuildingId(buildingId);
    }

    async updateEvent(
        id: string,
        data: UpdateEventInput
    ): Promise<Database['public']['Tables']['events']['Row']> {
        return this.eventsRepository.update(id, data);
    }

    async deleteEvent(id: string): Promise<void> {
        return this.eventsRepository.delete(id);
    }
}
