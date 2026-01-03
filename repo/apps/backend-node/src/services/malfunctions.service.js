export class MalfunctionsService {
    malfunctionRepository;
    storageService;
    constructor(malfunctionRepository, storageService) {
        this.malfunctionRepository = malfunctionRepository;
        this.storageService = storageService;
    }
    async reportMalfunction(data, imageFile) {
        let imageUrl = data.image_url;
        if (imageFile) {
            const path = `malfunctions/${Date.now()}_${imageFile.originalname}`;
            imageUrl = await this.storageService.uploadImage('malfunctions', path, imageFile.buffer, imageFile.mimetype);
        }
        return this.malfunctionRepository.create({
            ...data,
            image_url: imageUrl
        });
    }
    async getMalfunction(id) {
        return this.malfunctionRepository.findById(id);
    }
    async getTenantMalfunctions(tenantId) {
        return this.malfunctionRepository.findByTenantId(tenantId);
    }
}
