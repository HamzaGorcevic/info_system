import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Malfunction } from '@repo/domain';
export type { Malfunction };
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MalfunctionService {
    private apiUrl = `${environment.apiUrl}/malfunctions`;

    constructor(private http: HttpClient) { }

    reportMalfunction(formData: FormData): Observable<Malfunction> {
        return this.http.post<Malfunction>(this.apiUrl, formData);
    }

    getTenantMalfunctions(tenantId: string): Observable<Malfunction[]> {
        return this.http.get<Malfunction[]>(`${this.apiUrl}/tenant/${tenantId}`);
    }

    getAllMalfunctions(): Observable<Malfunction[]> {
        return this.http.get<Malfunction[]>(this.apiUrl);
    }

    rateMalfunction(data: { malfunction_id: string, servicer_id: string, rating_score: number, comment: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/rate`, data);
    }
}
