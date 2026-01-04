import { IContext } from "../types/context.interface.js";
import { AuthService } from "../services/auth.service.js";
import { BuildingService } from "../services/building.service.js";
import { MalfunctionsService } from "../services/malfunctions.service.js";
import { ServicersService } from "../services/servicers.service.js";
import { EventsService } from "../services/events.service.js";
import { MessagesService } from "../services/messages.service.js";
import { SuggestionsService } from "../services/suggestions.service.js";
import { RepositoryFactory } from "./repository.factory.js";

export class ServiceFactory {
    static getAuthService(context: IContext): AuthService {
        const userRepository = RepositoryFactory.getUserRepository(context);
        const buildingRepository = RepositoryFactory.getBuildingRepository(context);
        return new AuthService(userRepository, buildingRepository);
    }

    static getBuildingService(context: IContext): BuildingService {
        const buildingRepository = RepositoryFactory.getBuildingRepository(context);
        const userRepository = RepositoryFactory.getUserRepository(context);
        return new BuildingService(buildingRepository, userRepository);
    }

    static getMalfunctionsService(context: IContext): MalfunctionsService {
        const malfunctionRepository = RepositoryFactory.getMalfunctionsRepository(context);
        const storageService = RepositoryFactory.getStorageService(context);
        return new MalfunctionsService(malfunctionRepository, storageService);
    }

    static getServicersService(context: IContext): ServicersService {
        const servicersRepository = RepositoryFactory.getServicersRepository(context);
        return new ServicersService(servicersRepository);
    }

    static getEventsService(context: IContext): EventsService {
        const eventsRepository = RepositoryFactory.getEventsRepository(context);
        return new EventsService(eventsRepository);
    }

    static getMessagesService(context: IContext): MessagesService {
        const messagesRepository = RepositoryFactory.getMessagesRepository(context);
        return new MessagesService(messagesRepository);
    }

    static getSuggestionsService(context: IContext): SuggestionsService {
        const suggestionsRepository = RepositoryFactory.getSuggestionsRepository(context);
        return new SuggestionsService(suggestionsRepository);
    }
}
