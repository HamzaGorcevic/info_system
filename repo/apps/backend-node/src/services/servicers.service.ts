import { IServicerRepository, CreateServicerInput } from "@repo/domain";
import { Database } from "@repo/types";
import crypto from 'crypto';

export class ServicersService {
    constructor(
        private servicersRepository: IServicerRepository
    ) { }

    async createServicer(data: CreateServicerInput): Promise<Database['public']['Tables']['servicers']['Row']> {
        return this.servicersRepository.create(data);
    }

    async getAllServicers(): Promise<Database['public']['Tables']['servicers']['Row'][]> {
        return this.servicersRepository.findAll();
    }

    async assignToken(servicerId: string, malfunctionId: string, grantedBy: string): Promise<string> {
        const buildingId = await this.servicersRepository.getBuildingIdFromMalfunction(malfunctionId);

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

        await this.servicersRepository.createGuestToken({
            token,
            servicer_id: servicerId,
            malfunction_id: malfunctionId,
            building_id: buildingId,
            granted_by: grantedBy,
            expires_at: expiresAt.toISOString(),
            is_active: true
        });

        await this.servicersRepository.assignServicerToMalfunction(malfunctionId, servicerId);

        return token;
    }

    async verifyToken(token: string): Promise<any> {
        const tokenRecord = await this.servicersRepository.validateGuestToken(token);
        if (!tokenRecord) {
            throw new Error('Invalid or expired token');
        }
        return tokenRecord;
    }

    async updateStatus(token: string, status: string): Promise<void> {
        const tokenRecord = await this.verifyToken(token);
        const malfunctionId = tokenRecord.malfunction_id;
        await this.servicersRepository.updateMalfunctionStatus(malfunctionId, status);
    }

    async getAllTokens(): Promise<any[]> {
        return this.servicersRepository.getAllTokens();
    }

    async revokeToken(tokenId: string): Promise<void> {
        return this.servicersRepository.revokeToken(tokenId);
    }
}
