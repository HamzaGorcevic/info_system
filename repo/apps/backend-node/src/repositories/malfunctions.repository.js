export class MalfunctionsRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async create(data) {
        const { data: result, error } = await this.client
            .from('malfunctions')
            .insert(data)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return result;
    }
    async findById(id) {
        const { data, error } = await this.client
            .from('malfunctions')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async findByTenantId(tenantId) {
        const { data, error } = await this.client
            .from('malfunctions')
            .select('*')
            .eq('tenant_id', tenantId);
        if (error)
            throw new Error(error.message);
        return data;
    }
    async update(id, data) {
        const { data: result, error } = await this.client
            .from('malfunctions')
            .update(data)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return result;
    }
}
