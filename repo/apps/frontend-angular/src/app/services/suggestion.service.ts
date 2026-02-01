import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSuggestionDto, CreateSuggestionVoteDto, Suggestion, SuggestionWithVote } from '@repo/domain';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SuggestionService {
    private apiUrl = `${environment.apiUrl}/suggestions`;

    constructor(private http: HttpClient) { }

    createSuggestion(suggestion: CreateSuggestionDto): Observable<Suggestion> {
        return this.http.post<Suggestion>(this.apiUrl, suggestion);
    }

    getSuggestionsByBuilding(buildingId: string): Observable<SuggestionWithVote[]> {
        return this.http.get<SuggestionWithVote[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    deleteSuggestion(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    voteSuggestion(vote: CreateSuggestionVoteDto): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/vote`, vote);
    }
}
