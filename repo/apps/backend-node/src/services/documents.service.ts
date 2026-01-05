import { DocumentsRepository } from "../repositories/documents.repository.js";
import { SupabaseStorageService } from "./storage.service.js";

export class DocumentsService {
    constructor(
        private documentsRepository: DocumentsRepository,
        private storageService: SupabaseStorageService
    ) { }

    async uploadDocument(
        data: { title: string, building_id: string, uploaded_by: string },
        file: { buffer: Buffer, mimetype: string, originalname: string }
    ) {
        const path = `documents/${data.building_id}/${Date.now()}_${file.originalname}`;
        const fileUrl = await this.storageService.uploadImage('documents', path, file.buffer, file.mimetype);

        return this.documentsRepository.create({
            ...data,
            file_url: fileUrl
        });
    }

    async getBuildingDocuments(buildingId: string) {
        return this.documentsRepository.findByBuildingId(buildingId);
    }

    async deleteDocument(id: string) {
        // Note: Ideally we should also delete from storage, but for now just DB
        return this.documentsRepository.delete(id);
    }
}
