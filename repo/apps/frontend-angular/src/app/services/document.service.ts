import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '@repo/domain';
export type { Document };
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private apiUrl = `${environment.apiUrl}/documents`;

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
