import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateExpenseDto, UpdateExpenseDto } from '@repo/domain';
import { Expense } from '@repo/domain';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private apiUrl = `${environment.apiUrl}/expenses`;

    constructor(private http: HttpClient) { }

    createExpense(data: CreateExpenseDto): Observable<Expense> {
        return this.http.post<Expense>(this.apiUrl, data);
    }

    getTenantExpenses(tenantId: string): Observable<Expense[]> {
        return this.http.get<Expense[]>(`${this.apiUrl}/tenant/${tenantId}`);
    }

    updateExpense(id: string, data: UpdateExpenseDto): Observable<Expense> {
        return this.http.patch<Expense>(`${this.apiUrl}/${id}`, data);
    }

    deleteExpense(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getAllExpenses(): Observable<Expense[]> {
        return this.http.get<Expense[]>(this.apiUrl);
    }

    notifyTenant(id: string, message: string): Observable<{ status: string; expense: Expense }> {
        return this.http.post<{ status: string; expense: Expense }>(`${this.apiUrl}/${id}/notify`, { message });
    }
}
