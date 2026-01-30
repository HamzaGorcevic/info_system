import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Database } from '@repo/types';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService {
    private apiUrl = 'http://localhost:4000/api/expenses';

    constructor(private http: HttpClient) { }

    createExpense(data: any): Observable<Database['public']['Tables']['tenant_expenses']['Row']> {
        return this.http.post<Database['public']['Tables']['tenant_expenses']['Row']>(this.apiUrl, data);
    }

    getTenantExpenses(tenantId: string): Observable<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        return this.http.get<Database['public']['Tables']['tenant_expenses']['Row'][]>(`${this.apiUrl}/tenant/${tenantId}`);
    }

    updateExpense(id: string, data: any): Observable<Database['public']['Tables']['tenant_expenses']['Row']> {
        return this.http.patch<Database['public']['Tables']['tenant_expenses']['Row']>(`${this.apiUrl}/${id}`, data);
    }

    deleteExpense(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getAllExpenses(): Observable<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        return this.http.get<Database['public']['Tables']['tenant_expenses']['Row'][]>(this.apiUrl);
    }

    notifyTenant(id: string, message: string): Observable<{ status: string; expense: Database['public']['Tables']['tenant_expenses']['Row'] }> {
        return this.http.post<{ status: string; expense: Database['public']['Tables']['tenant_expenses']['Row'] }>(`${this.apiUrl}/${id}/notify`, { message });
    }
}
