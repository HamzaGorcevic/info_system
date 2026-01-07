import { IExpensesRepository } from "@repo/domain";
import { Database } from "@repo/types";

export class ExpensesService {
    constructor(private expensesRepository: IExpensesRepository) { }

    async createExpense(data: Database['public']['Tables']['tenant_expenses']['Insert']): Promise<Database['public']['Tables']['tenant_expenses']['Row']> {
        return this.expensesRepository.create(data);
    }

    async getTenantExpenses(tenantId: string): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        return this.expensesRepository.findByTenantId(tenantId);
    }

    async updateExpense(id: string, data: Database['public']['Tables']['tenant_expenses']['Update']): Promise<Database['public']['Tables']['tenant_expenses']['Row']> {
        return this.expensesRepository.update(id, data);
    }

    async deleteExpense(id: string): Promise<void> {
        return this.expensesRepository.delete(id);
    }

    async getAllExpenses(): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        return this.expensesRepository.findAll();
    }
}
