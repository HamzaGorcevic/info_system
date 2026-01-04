import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, CreateMessageInput } from '@repo/domain';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = 'http://localhost:4000/api/messages';

    constructor(private http: HttpClient) { }

    createMessage(message: CreateMessageInput): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, message);
    }

    getMessagesByBuilding(buildingId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    deleteMessage(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
