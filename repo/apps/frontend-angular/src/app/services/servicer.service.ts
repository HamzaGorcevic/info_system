import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicer } from '../models/domain.models';

@Injectable({
    providedIn: 'root'
})
export class ServicerService {
    private apiUrl = 'http://localhost:4000/api/servicers';

    constructor(private http: HttpClient) { }

    createServicer(data: Partial<Servicer>): Observable<Servicer> {
        return this.http.post<Servicer>(this.apiUrl, data);
    }

    getAllServicers(): Observable<Servicer[]> {
        return this.http.get<Servicer[]>(this.apiUrl);
    }

    assignToken(data: { servicerId: string, malfunctionId: string }): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/assign-token`, data);
    }

    verifyToken(token: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/verify-token`, { token });
    }

    updateStatus(token: string, status: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/update-status`, { token, status });
    }

    getAllTokens(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/tokens`);
    }

    revokeToken(tokenId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/revoke-token`, { tokenId });
    }
}
