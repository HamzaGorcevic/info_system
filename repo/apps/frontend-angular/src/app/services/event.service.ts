import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventInput, UpdateEventInput } from '@repo/domain';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = 'http://localhost:4000/api/events';

    constructor(private http: HttpClient) { }

    createEvent(event: CreateEventInput): Observable<Event> {
        return this.http.post<Event>(this.apiUrl, event);
    }

    getEventsByBuilding(buildingId: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    updateEvent(id: string, event: UpdateEventInput): Observable<Event> {
        return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
