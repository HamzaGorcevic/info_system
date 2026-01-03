import { SupabaseClient } from "@repo/supabase";

export class SupabaseStorageService {
    constructor(private client: SupabaseClient) { }

    async uploadImage(bucket: string, path: string, file: Buffer, contentType: string): Promise<string> {
        const { data, error } = await this.client
            .storage
            .from(bucket)
            .upload(path, file, {
                contentType: contentType,
                upsert: true
            });

        if (error) throw new Error(error.message);

        const { data: publicUrlData } = this.client
            .storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrlData.publicUrl;
    }
}
