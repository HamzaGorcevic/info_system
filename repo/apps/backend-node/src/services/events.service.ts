import { IEventRepository, CreateEventDto, UpdateEventDto, Event } from "@repo/domain";

export class EventsService {
    constructor(
        private eventsRepository: IEventRepository
    ) { }

    async createEvent(
        data: CreateEventDto
    ): Promise<Event> {
        return this.eventsRepository.create(data);
    }

    async getEventsByBuilding(buildingId: string): Promise<Event[]> {
        return this.eventsRepository.findByBuildingId(buildingId);
    }

    async updateEvent(
        id: string,
        data: UpdateEventDto
    ): Promise<Event> {
        return this.eventsRepository.update(id, data);
    }

    async deleteEvent(id: string): Promise<void> {
        return this.eventsRepository.delete(id);
    }
}
