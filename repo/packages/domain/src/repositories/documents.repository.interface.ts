import { Document } from "../entities/document.entity.js";
import { CreateDocumentDto } from "../dto/document.dto.js";

export interface IDocumentRepository {
    create(data: CreateDocumentDto): Promise<Document>;
    findByBuildingId(buildingId: string): Promise<Document[]>;
    delete(id: string): Promise<void>;
}
