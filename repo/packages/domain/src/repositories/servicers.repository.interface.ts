import { Database } from "@repo/types";

export interface IServicerRepository {
    create(data: Database['public']['Tables']['servicers']['Insert']): Promise<Database['public']['Tables']['servicers']['Row']>;
    findById(id: string): Promise<Database['public']['Tables']['servicers']['Row'] | null>;
    findAll(): Promise<Database['public']['Tables']['servicers']['Row'][]>;
    createGuestToken(data: Database['public']['Tables']['guest_access_tokens']['Insert']): Promise<Database['public']['Tables']['guest_access_tokens']['Row']>;
    getBuildingIdFromMalfunction(malfunctionId: string): Promise<string>;
    validateGuestToken(token: string): Promise<any>;
    updateMalfunctionStatus(malfunctionId: string, status: string): Promise<void>;
    assignServicerToMalfunction(malfunctionId: string, servicerId: string): Promise<void>;
    getAllTokens(): Promise<any[]>;
    revokeToken(tokenId: string): Promise<void>;
}
