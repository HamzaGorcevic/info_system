import { Expense, CreateExpenseDto, UpdateExpenseDto } from "../index.js";

export interface IExpensesRepository {
    create(data: CreateExpenseDto & { created_by: string }): Promise<Expense>;
    findById(id: string): Promise<Expense | null>;
    findByTenantId(tenantId: string): Promise<Expense[]>;
    update(id: string, data: UpdateExpenseDto): Promise<Expense>;
    delete(id: string): Promise<void>;
    findByCreator(userId: string): Promise<Expense[]>;
}
