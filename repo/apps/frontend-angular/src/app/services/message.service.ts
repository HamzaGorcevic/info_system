import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, CreateMessageDto } from '@repo/domain';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = `${environment.apiUrl}/messages`;

    constructor(private http: HttpClient) { }

    createMessage(message: CreateMessageDto): Observable<Message> {
        return this.http.post<Message>(this.apiUrl, message);
    }

    getMessagesByBuilding(buildingId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    deleteMessage(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
