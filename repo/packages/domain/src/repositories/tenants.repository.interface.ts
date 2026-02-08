import { Tenant } from "../entities/tenant.entity.js";
import { CreateTenantDto } from "../dto/tenant.dto.js";

export interface ITenantRepository {
    create(tenant: CreateTenantDto): Promise<Tenant>;
    findByApartment(buildingId: string, apartmentNumber: number): Promise<Tenant | null>;
    findMaxTenantNumber(buildingId: string): Promise<number>;
    getNextTenantNumber(buildingId: string): Promise<number>;
    delete(id: string): Promise<void>;
}
