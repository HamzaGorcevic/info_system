import { Event } from "../entities/event.entity.js";
import { CreateEventDto, UpdateEventDto } from "../dto/event.dto.js";

export interface IEventRepository {
    create(data: CreateEventDto): Promise<Event>;
    findById(id: string): Promise<Event | null>;
    findByBuildingId(buildingId: string): Promise<Event[]>;
    update(id: string, data: UpdateEventDto): Promise<Event>;
    delete(id: string): Promise<void>;
}
