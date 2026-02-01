import { IExpensesRepository, IEventRepository, IBuildingRepository, Expense, CreateExpenseDto, UpdateExpenseDto, CreateEventDto } from "@repo/domain";

export class ExpensesService {
    constructor(
        private expensesRepository: IExpensesRepository,
        private eventsRepository?: IEventRepository,
        private buildingRepository?: IBuildingRepository
    ) { }

    async createExpense(data: CreateExpenseDto & { created_by: string }): Promise<Expense> {
        return this.expensesRepository.create(data);
    }

    async getTenantExpenses(tenantId: string): Promise<Expense[]> {
        return this.expensesRepository.findByTenantId(tenantId);
    }

    async updateExpense(id: string, data: UpdateExpenseDto): Promise<Expense> {
        return this.expensesRepository.update(id, data);
    }

    async deleteExpense(id: string): Promise<void> {
        return this.expensesRepository.delete(id);
    }

    async getAllExpenses(userId: string): Promise<Expense[]> {
        return this.expensesRepository.findByCreator(userId);
    }

    async notifyTenant(expenseId: string, message: string, userId: string): Promise<{ status: string, expense: Expense }> {
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
        } as CreateEventDto);

        return { status: 'success', expense };
    }
}
