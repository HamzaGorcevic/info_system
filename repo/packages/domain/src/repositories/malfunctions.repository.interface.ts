import { Malfunction } from "../entities/malfunction.entity.js";
import { CreateMalfunctionDto, RateMalfunctionDto } from "../dto/malfunctions.dto.js";
import { Rating } from "../entities/rating.entity.js";

export interface IMalfunctionRepository {
    create(data: CreateMalfunctionDto): Promise<Malfunction>;
    findById(id: string): Promise<Malfunction | null>;
    findByTenantId(tenantId: string): Promise<Malfunction[]>;
    update(id: string, data: Partial<CreateMalfunctionDto>): Promise<Malfunction>;
    findAll(): Promise<Malfunction[]>;
    rate(data: Rating): Promise<Rating>;
    findInterventionByMalfunctionAndServicer(malfunctionId: string, servicerId: string): Promise<any>;
}
