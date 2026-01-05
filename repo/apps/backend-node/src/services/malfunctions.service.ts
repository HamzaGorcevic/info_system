import { IMalfunctionRepository, CreateMalfunctionInput, IStorageService } from "@repo/domain";
import { Database } from "@repo/types";

export class MalfunctionsService {
    constructor(
        private malfunctionRepository: IMalfunctionRepository,
        private storageService: IStorageService
    ) { }

    async reportMalfunction(
        data: CreateMalfunctionInput,
        imageFile?: { buffer: Buffer, mimetype: string, originalname: string }
    ): Promise<Database['public']['Tables']['malfunctions']['Row']> {
        let imageUrl = data.image_url;

        if (imageFile) {
            const path = `malfunctions/${data.reporter_id}/${Date.now()}_${imageFile.originalname}`;
            imageUrl = await this.storageService.uploadImage('malfunctions', path, imageFile.buffer, imageFile.mimetype);
        }

        return this.malfunctionRepository.create({
            ...data,
            image_url: imageUrl
        });
    }

    async getMalfunction(
        id: string
    ): Promise<Database['public']['Tables']['malfunctions']['Row'] | null> {
        return this.malfunctionRepository.findById(id);
    }

    async getTenantMalfunctions(
        tenantId: string
    ): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        return this.malfunctionRepository.findByTenantId(tenantId);
    }

    async getAllMalfunctions(): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        return this.malfunctionRepository.findAll();
    }

    async rateMalfunction(
        data: any
    ): Promise<Database['public']['Tables']['ratings']['Row']> {
        const { malfunction_id, servicer_id, ...ratingData } = data;

        // Find intervention
        const intervention = await this.malfunctionRepository.findInterventionByMalfunctionAndServicer(malfunction_id, servicer_id);

        if (!intervention) {
            throw new Error('Intervention not found for this malfunction and servicer');
        }

        return this.malfunctionRepository.rate({
            ...ratingData,
            servicer_id,
            intervention_id: intervention.id
        });
    }
}