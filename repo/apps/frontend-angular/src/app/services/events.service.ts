import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Database } from '@repo/types';

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private apiUrl = 'http://localhost:4000/api/events';

    constructor(private http: HttpClient) { }

    createEvent(data: {
        building_id: string;
        title: string;
        scheduled_at: string;
        content?: string;
    }): Observable<Database['public']['Tables']['events']['Row']> {
        return this.http.post<Database['public']['Tables']['events']['Row']>(this.apiUrl, data);
    }

    getEventsByBuilding(buildingId: string): Observable<Database['public']['Tables']['events']['Row'][]> {
        return this.http.get<Database['public']['Tables']['events']['Row'][]>(`${this.apiUrl}/building/${buildingId}`);
    }

    updateEvent(id: string, data: any): Observable<Database['public']['Tables']['events']['Row']> {
        return this.http.patch<Database['public']['Tables']['events']['Row']>(`${this.apiUrl}/${id}`, data);
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
