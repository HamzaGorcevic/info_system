import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, CreateEventDto, UpdateEventDto } from '@repo/domain';

@Injectable({
    providedIn: 'root'
})
export class EventsService {
    private apiUrl = 'http://localhost:4000/api/events';

    constructor(private http: HttpClient) { }

    createEvent(data: CreateEventDto): Observable<Event> {
        return this.http.post<Event>(this.apiUrl, data);
    }

    getEventsByBuilding(buildingId: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    updateEvent(id: string, data: UpdateEventDto): Observable<Event> {
        return this.http.patch<Event>(`${this.apiUrl}/${id}`, data);
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
