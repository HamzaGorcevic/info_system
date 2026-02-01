import { IMalfunctionRepository, Malfunction, CreateMalfunctionDto, Rating, IStorageService, CreateRatingDto, RateMalfunctionDto } from "@repo/domain";

export class MalfunctionsService {
    constructor(
        private malfunctionRepository: IMalfunctionRepository,
        private storageService: IStorageService
    ) { }

    async reportMalfunction(
        data: CreateMalfunctionDto,
        imageFile?: { buffer: Buffer, mimetype: string, originalname: string }
    ): Promise<Malfunction> {
        let imageUrl = data.image_url;

        if (imageFile) {
            const path = `${data.reporter_id}/${Date.now()}_${imageFile.originalname}`;
            imageUrl = await this.storageService.uploadImage('malfunctions', path, imageFile.buffer, imageFile.mimetype);
        }

        return this.malfunctionRepository.create({
            ...data,
            image_url: imageUrl
        });
    }

    async getMalfunction(
        id: string
    ): Promise<Malfunction | null> {
        return this.malfunctionRepository.findById(id);
    }

    async getTenantMalfunctions(
        tenantId: string
    ): Promise<Malfunction[]> {
        return this.malfunctionRepository.findByTenantId(tenantId);
    }

    async getAllMalfunctions(): Promise<Malfunction[]> {
        return this.malfunctionRepository.findAll();
    }

    async rateMalfunction(
        data: RateMalfunctionDto & { rated_by: string }
    ): Promise<Rating> {
        const { malfunction_id, servicer_id, ...ratingData } = data;

        const intervention = await this.malfunctionRepository.findInterventionByMalfunctionAndServicer(malfunction_id, servicer_id);

        if (!intervention) {
            throw new Error('Intervention not found for this malfunction and servicer');
        }

        return this.malfunctionRepository.rate({
            ...ratingData,
            servicer_id,
            intervention_id: intervention.id,
            rated_by: data.rated_by
        } as Rating);
    }
}