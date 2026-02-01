import { SupabaseClient } from "@repo/supabase";
import { IUserRepository, User, CreateUserDto, UpdateUserDto } from "@repo/domain";
import { Database } from "@repo/types";


export class UserRepository implements IUserRepository {
    constructor(private client: SupabaseClient<Database>) { }

    async findById(id: string): Promise<User | null> {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error || !data) return null;
        return data as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await this.client
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !data) return null;
        return data as User;
    }

    async create(user: CreateUserDto): Promise<User> {
        const { data, error } = await this.client
            .from('users')
            .insert(user)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    }

    async update(id: string, user: UpdateUserDto): Promise<User> {
        const { data, error } = await this.client
            .from('users')
            .update(user)
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data as User;
    }

    async verifyUser(id: string, adminId: string): Promise<void> {
        const { error } = await this.client
            .from('users')
            .update({
                is_verified: true,
                verified_by: adminId,
                verified_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }


}
