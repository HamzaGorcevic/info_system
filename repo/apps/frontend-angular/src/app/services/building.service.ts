import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building, Tenant } from '@repo/domain';

@Injectable({
    providedIn: 'root'
})
export class BuildingService {
    private apiUrl = 'http://localhost:4000/api/buildings';

    constructor(private http: HttpClient) { }

    getUnverifiedTenants(buildingId: string): Observable<Tenant[]> {
        return this.http.get<Tenant[]>(`${this.apiUrl}/${buildingId}/unverified-tenants`);
    }

    verifyTenant(userId: string, adminId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify-tenant/${userId}`, { adminId });
    }

    getTenantData(userId: string): Observable<Tenant | null> {
        return this.http.get<Tenant | null>(`${this.apiUrl}/tenant/${userId}`);
    }

    getBuildingTenants(buildingId: string): Observable<Tenant[]> {
        return this.http.get<Tenant[]>(`${this.apiUrl}/${buildingId}/tenants`);
    }
}
