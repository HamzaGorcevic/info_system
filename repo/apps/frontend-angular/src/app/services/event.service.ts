import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventDto, UpdateEventDto } from '@repo/domain';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = `${environment.apiUrl}/events`;

    constructor(private http: HttpClient) { }

    createEvent(event: CreateEventDto): Observable<Event> {
        return this.http.post<Event>(this.apiUrl, event);
    }

    getEventsByBuilding(buildingId: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    updateEvent(id: string, event: UpdateEventDto): Observable<Event> {
        return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
