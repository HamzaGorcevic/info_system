import { IServicerRepository, CreateServicerInput } from "@repo/domain";
import { Database } from "@repo/types";
import crypto from 'crypto';

export class ServicersService {

    async createServicer(
        servicersRepository: IServicerRepository,
        data: CreateServicerInput
    ): Promise<Database['public']['Tables']['servicers']['Row']> {
        return servicersRepository.create(data);
    }

    async getAllServicers(
        servicersRepository: IServicerRepository
    ): Promise<Database['public']['Tables']['servicers']['Row'][]> {
        return servicersRepository.findAll();
    }

    async assignToken(
        servicersRepository: IServicerRepository,
        servicerId: string,
        malfunctionId: string,
        grantedBy: string
    ): Promise<string> {
        const buildingId = await servicersRepository.getBuildingIdFromMalfunction(malfunctionId);

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        await servicersRepository.createGuestToken({
            token,
            servicer_id: servicerId,
            malfunction_id: malfunctionId,
            building_id: buildingId,
            granted_by: grantedBy,
            expires_at: expiresAt.toISOString(),
            is_active: true
        });

        await servicersRepository.assignServicerToMalfunction(malfunctionId, servicerId);

        return token;
    }

    async verifyToken(
        servicersRepository: IServicerRepository,
        token: string
    ): Promise<any> {
        const tokenRecord = await servicersRepository.validateGuestToken(token);
        if (!tokenRecord) {
            throw new Error('Invalid or expired token');
        }
        return tokenRecord;
    }

    async updateStatus(
        servicersRepository: IServicerRepository,
        token: string,
        status: string
    ): Promise<void> {
        const tokenRecord = await this.verifyToken(servicersRepository, token);
        const malfunctionId = tokenRecord.malfunction_id;
        await servicersRepository.updateMalfunctionStatus(malfunctionId, status, token);
    }

    async getAllTokens(
        servicersRepository: IServicerRepository
    ): Promise<any[]> {
        return servicersRepository.getAllTokens();
    }

    async revokeToken(
        servicersRepository: IServicerRepository,
        tokenId: string
    ): Promise<void> {
        return servicersRepository.revokeToken(tokenId);
    }
}

export const servicersService = new ServicersService();
