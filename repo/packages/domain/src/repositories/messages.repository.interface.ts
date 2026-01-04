import { Database } from "@repo/types";

export interface IMessageRepository {
    create(data: Database['public']['Tables']['messages']['Insert']): Promise<Database['public']['Tables']['messages']['Row']>;
    findById(id: string): Promise<Database['public']['Tables']['messages']['Row'] | null>;
    findByBuildingId(buildingId: string): Promise<Database['public']['Tables']['messages']['Row'][]>;
    delete(id: string): Promise<void>;
}
