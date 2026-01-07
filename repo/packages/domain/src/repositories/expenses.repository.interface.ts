import { Database } from "@repo/types";

export interface IExpensesRepository {
    create(data: Database['public']['Tables']['tenant_expenses']['Insert']): Promise<Database['public']['Tables']['tenant_expenses']['Row']>;
    findById(id: string): Promise<Database['public']['Tables']['tenant_expenses']['Row'] | null>;
    findByTenantId(tenantId: string): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]>;
    update(id: string, data: Database['public']['Tables']['tenant_expenses']['Update']): Promise<Database['public']['Tables']['tenant_expenses']['Row']>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Database['public']['Tables']['tenant_expenses']['Row'][]>;
}
