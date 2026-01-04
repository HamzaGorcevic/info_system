import { IContext } from "../types/context.interface.js";
import { IMalfunctionRepository, IBuildingRepository, IUserRepository, IStorageService, IServicerRepository, IEventRepository, IMessageRepository, ISuggestionRepository } from "@repo/domain";
import { MalfunctionsRepository } from "../repositories/malfunctions.repository.js";
import { BuildingRepository } from "../repositories/building.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { ServicersRepository } from "../repositories/servicers.repository.js";
import { EventsRepository } from "../repositories/events.repository.js";
import { MessagesRepository } from "../repositories/messages.repository.js";
import { SuggestionsRepository } from "../repositories/suggestions.repository.js";
import { SupabaseStorageService } from "../services/storage.service.js";

export class RepositoryFactory {
    static getMalfunctionsRepository(context: IContext): IMalfunctionRepository {
        return new MalfunctionsRepository(context.db);
    }

    static getBuildingRepository(context: IContext): IBuildingRepository {
        return new BuildingRepository(context.db);
    }

    static getUserRepository(context: IContext): IUserRepository {
        return new UserRepository(context.db);
    }

    static getServicersRepository(context: IContext): IServicerRepository {
        return new ServicersRepository(context.db);
    }

    static getEventsRepository(context: IContext): IEventRepository {
        return new EventsRepository(context.db);
    }

    static getMessagesRepository(context: IContext): IMessageRepository {
        return new MessagesRepository(context.db);
    }

    static getSuggestionsRepository(context: IContext): ISuggestionRepository {
        return new SuggestionsRepository(context.db);
    }

    static getStorageService(context: IContext): IStorageService {
        return new SupabaseStorageService(context.db);
    }
}
