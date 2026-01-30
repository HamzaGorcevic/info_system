import { IExpensesRepository, IEventRepository, IBuildingRepository } from "@repo/domain";
import { Database } from "@repo/types";

export class ExpensesService {
    constructor(
        private expensesRepository: IExpensesRepository,
        private eventsRepository?: IEventRepository,
        private buildingRepository?: IBuildingRepository
    ) { }

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

    async getAllExpenses(userId: string): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        return this.expensesRepository.findByCreator(userId);
    }

    async notifyTenant(expenseId: string, message: string, userId: string): Promise<{ status: string, expense: Database['public']['Tables']['tenant_expenses']['Row'] }> {
        const expense = await this.expensesRepository.findById(expenseId);
        if (!expense) throw new Error("Expense not found");

        if (expense.status === 'paid') {
            return { status: 'already_paid', expense };
        }

        if (!this.eventsRepository || !this.buildingRepository) {
            throw new Error("Dependencies missing for notification");
        }

        // Find tenant to get building
        const tenant = await this.buildingRepository.findTenantById(expense.tenant_id);
        if (!tenant) throw new Error("Tenant not found");

        // Create Event (Announcement)
        await this.eventsRepository.create({
            building_id: tenant.building_id,
            title: 'Payment Reminder',
            content: message,
            scheduled_at: new Date().toISOString(),
            created_by: userId
        });

        return { status: 'success', expense };
    }
}
