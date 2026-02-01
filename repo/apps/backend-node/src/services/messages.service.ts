import { IMessageRepository, CreateMessageDto, Message } from "@repo/domain";

export class MessagesService {
    constructor(
        private messagesRepository: IMessageRepository
    ) { }

    async createMessage(
        data: CreateMessageDto
    ): Promise<Message> {
        return this.messagesRepository.create(data);
    }

    async getMessagesByBuilding(buildingId: string): Promise<Message[]> {
        return this.messagesRepository.findByBuildingId(buildingId);
    }

    async deleteMessage(id: string): Promise<void> {
        return this.messagesRepository.delete(id);
    }
}
