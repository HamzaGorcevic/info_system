import { supabaseAdmin } from "@repo/supabase";
export class SupabaseStorageService {
    client;
    constructor(client) {
        this.client = client;
    }
    async uploadImage(bucket, path, file, contentType) {
        const { data, error } = await supabaseAdmin
            .storage
            .from(bucket)
            .upload(path, file, {
            contentType: contentType,
            upsert: true
        });
        if (error)
            throw new Error(error.message);
        const { data: publicUrlData } = this.client
            .storage
            .from(bucket)
            .getPublicUrl(path);
        return publicUrlData.publicUrl;
    }
}
