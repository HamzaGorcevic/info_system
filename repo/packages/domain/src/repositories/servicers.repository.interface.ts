import { CreateServicerDto } from "../dto/servicer.dto.js";
import { Servicer } from "../entities/servicer.entity.js";
import { GuestAccessToken } from "../entities/guest-access-token.entity.js";
import { CreateGuestAccessTokenDto } from "../dto/guest-access-token.dto.js";

export interface IServicerRepository {
    create(data: CreateServicerDto): Promise<Servicer>;
    findById(id: string): Promise<Servicer | null>;
    findAll(): Promise<Servicer[]>;
    createGuestToken(data: CreateGuestAccessTokenDto): Promise<GuestAccessToken>;
    getBuildingIdFromMalfunction(malfunctionId: string): Promise<string>;
    validateGuestToken(token: string): Promise<GuestAccessToken | null>;
    updateMalfunctionStatus(malfunctionId: string, status: string, token: string): Promise<void>;
    assignServicerToMalfunction(malfunctionId: string, servicerId: string): Promise<void>;
    getAllTokens(): Promise<GuestAccessToken[]>;
    revokeToken(tokenId: string): Promise<void>;
}
