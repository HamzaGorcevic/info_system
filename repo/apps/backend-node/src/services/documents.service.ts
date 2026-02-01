import { IDocumentRepository, CreateDocumentDto, Document, IStorageService } from "@repo/domain";

export class DocumentsService {
    constructor(
        private documentsRepository: IDocumentRepository,
        private storageService: IStorageService
    ) { }

    async uploadDocument(
        data: { title: string, building_id: string, uploaded_by: string },
        file: { buffer: Buffer, mimetype: string, originalname: string }
    ): Promise<Document> {
        const path = `${data.building_id}/${Date.now()}_${file.originalname}`;
        const fileUrl = await this.storageService.uploadImage('documents', path, file.buffer, file.mimetype);

        return this.documentsRepository.create({
            ...data,
            file_url: fileUrl
        } as CreateDocumentDto);
    }

    async getBuildingDocuments(buildingId: string): Promise<Document[]> {
        return this.documentsRepository.findByBuildingId(buildingId);
    }

    async deleteDocument(id: string): Promise<void> {
        // Note: Ideally we should also delete from storage, but for now just DB
        return this.documentsRepository.delete(id);
    }
}
