import { IContext } from "../types/context.interface.js";
import { AuthService } from "../services/auth.service.js";
import { BuildingService } from "../services/building.service.js";
import { supabaseAdmin } from "@repo/supabase";
import { MalfunctionsService } from "../services/malfunctions.service.js";
import { ServicersService } from "../services/servicers.service.js";
import { EventsService } from "../services/events.service.js";
import { MessagesService } from "../services/messages.service.js";
import { SuggestionsService } from "../services/suggestions.service.js";
import { DocumentsService } from "../services/documents.service.js";
import { ExpensesService } from "../services/expenses.service.js";
import { RepositoryFactory } from "./repository.factory.js";



export class ServiceFactory {
    static getAuthService(context: IContext): AuthService {
        const adminContext = { ...context, db: supabaseAdmin };
        const userRepository = RepositoryFactory.getUserRepository(adminContext);
        const buildingRepository = RepositoryFactory.getBuildingRepository(adminContext);
        const tenantRepository = RepositoryFactory.getTenantRepository(adminContext);
        return new AuthService(userRepository, buildingRepository, tenantRepository);
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
        const adminContext = { ...context, db: supabaseAdmin };
        const suggestionsRepository = RepositoryFactory.getSuggestionsRepository(adminContext);
        return new SuggestionsService(suggestionsRepository);
    }

    static getDocumentsService(context: IContext): DocumentsService {
        const documentsRepository = RepositoryFactory.getDocumentsRepository(context);
        const storageService = RepositoryFactory.getStorageService(context);
        return new DocumentsService(documentsRepository, storageService as any);
    }

    static getExpensesService(context: IContext): ExpensesService {
        const expensesRepository = RepositoryFactory.getExpensesRepository(context);
        const eventsRepository = RepositoryFactory.getEventsRepository(context);
        const buildingRepository = RepositoryFactory.getBuildingRepository(context);
        return new ExpensesService(expensesRepository, eventsRepository, buildingRepository);
    }
}
