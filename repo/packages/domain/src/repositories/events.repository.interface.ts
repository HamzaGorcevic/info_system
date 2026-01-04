import { Database } from "@repo/types";

export interface IEventRepository {
    create(data: Database['public']['Tables']['events']['Insert']): Promise<Database['public']['Tables']['events']['Row']>;
    findById(id: string): Promise<Database['public']['Tables']['events']['Row'] | null>;
    findByBuildingId(buildingId: string): Promise<Database['public']['Tables']['events']['Row'][]>;
    update(id: string, data: Database['public']['Tables']['events']['Update']): Promise<Database['public']['Tables']['events']['Row']>;
    delete(id: string): Promise<void>;
}
