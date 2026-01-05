import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Document {
    id: string;
    building_id: string;
    title: string;
    file_url: string;
    created_at: string;
    uploaded_by: string;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private apiUrl = 'http://localhost:4000/api/documents';

    constructor(private http: HttpClient) { }

    uploadDocument(file: File, title: string, buildingId: string, uploadedBy: string): Observable<Document> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('building_id', buildingId);
        formData.append('uploaded_by', uploadedBy);

        return this.http.post<Document>(this.apiUrl, formData);
    }

    getDocumentsByBuilding(buildingId: string): Observable<Document[]> {
        return this.http.get<Document[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    deleteDocument(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
