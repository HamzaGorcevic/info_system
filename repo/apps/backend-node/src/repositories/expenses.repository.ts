import { IExpensesRepository } from "@repo/domain";
import { Database } from "@repo/types";
import { SupabaseClient } from "@repo/supabase";

export class ExpensesRepository implements IExpensesRepository {
    constructor(private db: SupabaseClient<Database>) { }

    async create(data: Database['public']['Tables']['tenant_expenses']['Insert']): Promise<Database['public']['Tables']['tenant_expenses']['Row']> {
        const { data: expense, error } = await this.db
            .from('tenant_expenses')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return expense;
    }

    async findById(id: string): Promise<Database['public']['Tables']['tenant_expenses']['Row'] | null> {
        const { data: expense, error } = await this.db
            .from('tenant_expenses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return expense;
    }

    async findByTenantId(tenantId: string): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        const { data: expenses, error } = await this.db
            .from('tenant_expenses')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return expenses;
    }

    async update(id: string, data: Database['public']['Tables']['tenant_expenses']['Update']): Promise<Database['public']['Tables']['tenant_expenses']['Row']> {
        const { data: expense, error } = await this.db
            .from('tenant_expenses')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return expense;
    }

    async delete(id: string): Promise<void> {
        const { error } = await this.db
            .from('tenant_expenses')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async findAll(): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]> {
        const { data: expenses, error } = await this.db
            .from('tenant_expenses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return expenses;
    }
}
