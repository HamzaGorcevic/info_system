import { Database } from "@repo/types";

export interface IMalfunctionRepository {
    create(data: Database['public']['Tables']['malfunctions']['Insert']): Promise<Database['public']['Tables']['malfunctions']['Row']>;
    findById(id: string): Promise<Database['public']['Tables']['malfunctions']['Row'] | null>;
    findByTenantId(tenantId: string): Promise<Database['public']['Tables']['malfunctions']['Row'][]>;
    update(id: string, data: Database['public']['Tables']['malfunctions']['Update']): Promise<Database['public']['Tables']['malfunctions']['Row']>;
    findAll(): Promise<Database['public']['Tables']['malfunctions']['Row'][]>;
    rate(data: Database['public']['Tables']['ratings']['Insert']): Promise<Database['public']['Tables']['ratings']['Row']>;
    findInterventionByMalfunctionAndServicer(malfunctionId: string, servicerId: string): Promise<any>;
}
