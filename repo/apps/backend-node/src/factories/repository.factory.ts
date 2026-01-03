import { IContext } from "../types/context.interface.js";
import { IMalfunctionRepository, IBuildingRepository, IUserRepository, IStorageService, IServicerRepository } from "@repo/domain";
import { MalfunctionsRepository } from "../repositories/malfunctions.repository.js";
import { BuildingRepository } from "../repositories/building.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { ServicersRepository } from "../repositories/servicers.repository.js";
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

    static getStorageService(context: IContext): IStorageService {
        return new SupabaseStorageService(context.db);
    }
}
