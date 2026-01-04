import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion, CreateSuggestionInput, SuggestionWithVote, CreateSuggestionVoteInput } from '@repo/domain';

@Injectable({
    providedIn: 'root'
})
export class SuggestionService {
    private apiUrl = 'http://localhost:4000/api/suggestions';

    constructor(private http: HttpClient) { }

    createSuggestion(suggestion: CreateSuggestionInput): Observable<Suggestion> {
        return this.http.post<Suggestion>(this.apiUrl, suggestion);
    }

    getSuggestionsByBuilding(buildingId: string): Observable<SuggestionWithVote[]> {
        return this.http.get<SuggestionWithVote[]>(`${this.apiUrl}/building/${buildingId}`);
    }

    deleteSuggestion(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    voteSuggestion(vote: CreateSuggestionVoteInput): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/vote`, vote);
    }
}
