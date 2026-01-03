export class ServicersRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async create(data) {
        const { data: result, error } = await this.client
            .from('servicers')
            .insert(data)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return result;
    }
    async findById(id) {
        const { data, error } = await this.client
            .from('servicers')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async findAll() {
        const { data, error } = await this.client
            .from('servicers')
            .select('*');
        if (error)
            throw new Error(error.message);
        return data;
    }
    async createGuestToken(data) {
        const { data: result, error } = await this.client
            .from('guest_access_tokens')
            .insert(data)
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return result;
    }
}
