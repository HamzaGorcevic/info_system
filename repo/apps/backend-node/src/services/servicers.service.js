import crypto from 'crypto';
export class ServicersService {
    servicersRepository;
    constructor(servicersRepository) {
        this.servicersRepository = servicersRepository;
    }
    async createServicer(data) {
        return this.servicersRepository.create(data);
    }
    async getAllServicers() {
        return this.servicersRepository.findAll();
    }
    async assignToken(servicerId, malfunctionId, buildingId, grantedBy) {
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
        return token;
    }
}
