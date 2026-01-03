import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantData } from '../models/domain.models';

@Injectable({
    providedIn: 'root'
})
export class BuildingService {
    private apiUrl = 'http://localhost:4000/api/buildings';

    constructor(private http: HttpClient) { }

    getUnverifiedTenants(buildingId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${buildingId}/unverified-tenants`);
    }

    verifyTenant(userId: string, adminId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-tenant/${userId}`, { adminId });
    }

    getTenantData(userId: string): Observable<TenantData> {
        return this.http.get<TenantData>(`${this.apiUrl}/tenant/${userId}`);
    }
}
