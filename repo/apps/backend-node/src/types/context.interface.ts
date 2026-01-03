import { SupabaseClient } from "@repo/supabase";

export interface IContext {

    currentUser: { id: string; role: string } | null;

    db: SupabaseClient;
}
