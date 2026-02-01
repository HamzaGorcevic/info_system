import { Message } from "../entities/message.entity.js";
import { CreateMessageDto } from "../dto/message.dto.js";

export interface IMessageRepository {
    create(data: CreateMessageDto): Promise<Message>;
    findById(id: string): Promise<Message | null>;
    findByBuildingId(buildingId: string): Promise<Message[]>;
    delete(id: string): Promise<void>;
}
