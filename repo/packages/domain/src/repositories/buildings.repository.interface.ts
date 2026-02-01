import { Building } from "../entities/building.entity.js";
import { Tenant } from "../entities/tenant.entity.js";
import { UpdateTenantDto } from "../dto/tenant.dto.js";

export interface IBuildingRepository {
    findUnverifiedTenants(buildingId: string): Promise<Tenant[]>;
    findBuildingTenants(buildingId: string): Promise<Tenant[]>;

    findTenantByUserId(userId: string): Promise<Tenant | null>;
    countOwnersInApartment(buildingId: string, apartmentNumber: number): Promise<number>;
    updateTenant(tenantId: string, data: UpdateTenantDto): Promise<Tenant>;

    findBuildingsByManagerId(userId: string): Promise<Building[]>;
    findTenantById(id: string): Promise<Tenant | null>;
}