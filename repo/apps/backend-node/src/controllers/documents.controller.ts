import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';

export class DocumentsController {
    async upload(req: Request, res: Response, next: NextFunction) {
        const documentsService = ServiceFactory.getDocumentsService(req.context);
        const file = req.file;

        if (!file) throw new Error("No file uploaded");

        const result = await documentsService.uploadDocument(
            {
                title: req.body.title,
                building_id: req.body.building_id,
                uploaded_by: req.body.uploaded_by
            },
            {
                buffer: file.buffer,
                mimetype: file.mimetype,
                originalname: file.originalname
            }
        );

        res.status(201).json(result);
    }

    async getByBuilding(req: Request, res: Response, next: NextFunction) {
        const documentsService = ServiceFactory.getDocumentsService(req.context);
        const { buildingId } = req.params;
        const result = await documentsService.getBuildingDocuments(buildingId);
        res.status(200).json(result);
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const documentsService = ServiceFactory.getDocumentsService(req.context);
        const { id } = req.params;
        await documentsService.deleteDocument(id);
        res.status(204).send();
    }
}

export const documentsController = new DocumentsController();
