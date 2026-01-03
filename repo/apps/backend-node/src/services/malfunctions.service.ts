import { IMalfunctionRepository, CreateMalfunctionInput, IStorageService } from "@repo/domain";
import { Database } from "@repo/types";

export class MalfunctionsService {

    async reportMalfunction(
        malfunctionRepository: IMalfunctionRepository,
        storageService: IStorageService,
        data: CreateMalfunctionInput,
        imageFile?: { buffer: Buffer, mimetype: string, originalname: string }
    ): Promise<Database['public']['Tables']['malfunctions']['Row']> {
        let imageUrl = data.image_url;

        if (imageFile) {
            const path = `malfunctions/${Date.now()}_${imageFile.originalname}`;
            imageUrl = await storageService.uploadImage('malfunctions', path, imageFile.buffer, imageFile.mimetype);
        }

        return malfunctionRepository.create({
            ...data,
            image_url: imageUrl
        });
    }

    async getMalfunction(
        malfunctionRepository: IMalfunctionRepository,
        id: string
    ): Promise<Database['public']['Tables']['malfunctions']['Row'] | null> {
        return malfunctionRepository.findById(id);
    }

    async getTenantMalfunctions(
        malfunctionRepository: IMalfunctionRepository,
        tenantId: string
    ): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        return malfunctionRepository.findByTenantId(tenantId);
    }

    async getAllMalfunctions(
        malfunctionRepository: IMalfunctionRepository
    ): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        return malfunctionRepository.findAll();
    }

    async rateMalfunction(
        malfunctionRepository: IMalfunctionRepository,
        data: Database['public']['Tables']['ratings']['Insert']
    ): Promise<Database['public']['Tables']['ratings']['Row']> {
        return malfunctionRepository.rate(data);
    }
}

export const malfunctionsService = new MalfunctionsService();