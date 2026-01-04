import { IMessageRepository, CreateMessageInput } from "@repo/domain";
import { Database } from "@repo/types";

export class MessagesService {
    constructor(
        private messagesRepository: IMessageRepository
    ) { }

    async createMessage(
        data: CreateMessageInput & { posted_by: string }
    ): Promise<Database['public']['Tables']['messages']['Row']> {
        return this.messagesRepository.create(data);
    }

    async getMessagesByBuilding(buildingId: string): Promise<Database['public']['Tables']['messages']['Row'][]> {
        return this.messagesRepository.findByBuildingId(buildingId);
    }

    async deleteMessage(id: string): Promise<void> {
        return this.messagesRepository.delete(id);
    }
}
