import { IMalfunctionRepository, CreateMalfunctionInput } from "@repo/domain";
import { Database } from "@repo/types";
import { SupabaseStorageService } from "./storage.service.js";

export class MalfunctionsService {
    constructor(
        private malfunctionRepository: IMalfunctionRepository,
        private storageService: SupabaseStorageService
    ) { }

    async reportMalfunction(
        data: CreateMalfunctionInput,
        imageFile?: { buffer: Buffer, mimetype: string, originalname: string }
    ): Promise<Database['public']['Tables']['malfunctions']['Row']> {
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

    async getMalfunction(id: string): Promise<Database['public']['Tables']['malfunctions']['Row'] | null> {
        return this.malfunctionRepository.findById(id);
    }

    async getTenantMalfunctions(tenantId: string): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        return this.malfunctionRepository.findByTenantId(tenantId);
    }

    async getAllMalfunctions(): Promise<Database['public']['Tables']['malfunctions']['Row'][]> {
        return this.malfunctionRepository.findAll();
    }

    async rateMalfunction(data: Database['public']['Tables']['ratings']['Insert']): Promise<Database['public']['Tables']['ratings']['Row']> {
        return this.malfunctionRepository.rate(data);
    }
}