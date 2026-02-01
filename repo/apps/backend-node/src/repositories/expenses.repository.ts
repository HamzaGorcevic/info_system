import { IExpensesRepository, Expense, CreateExpenseDto, UpdateExpenseDto } from "@repo/domain";
import { SupabaseClient } from "@repo/supabase";
import { Database } from "@repo/types";

export class ExpensesRepository implements IExpensesRepository {
    constructor(private db: SupabaseClient<Database>) { }

    async create(data: CreateExpenseDto & { created_by: string }): Promise<Expense> {
        const { data: expense, error } = await this.db
            .from('tenant_expenses')
            .insert(data as any)
            .select()
            .single();

        if (error) throw error;
        return expense as Expense;
    }

    async findById(id: string): Promise<Expense | null> {
        const { data: expense, error } = await this.db
            .from('tenant_expenses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return expense as Expense;
    }

    async findByTenantId(tenantId: string): Promise<Expense[]> {
        const { data: expenses, error } = await this.db
            .from('tenant_expenses')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return expenses as Expense[];
    }

    async update(id: string, data: UpdateExpenseDto): Promise<Expense> {
        const { data: expense, error } = await this.db
            .from('tenant_expenses')
            .update(data as any)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return expense as Expense;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.db
            .from('tenant_expenses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async findByCreator(userId: string): Promise<Expense[]> {
        const { data: expenses, error } = await this.db
            .from('tenant_expenses')
            .select('*, tenants!inner(buildings!inner(manager_id))')
            .eq('tenants.buildings.manager_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return expenses.map((e: any) => {
            const { tenants, ...expense } = e;
            return expense;
        }) as Expense[];
    }
}
