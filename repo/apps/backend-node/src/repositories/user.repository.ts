import { supabaseAdmin, supabase } from "@repo/supabase"
import { IUserRepository, User, CreateUserInput, UpdateUserInput } from "@repo/domain";
import { Database } from "@repo/types";

type DBUser = Database['public']['Tables']['users']['Row'];

export class UserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) return null;
        return this.mapToDomain(data as DBUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !data) return null;
        return this.mapToDomain(data as DBUser);
    }

    async create(user: CreateUserInput): Promise<User> {
        const { data, error } = await supabaseAdmin
            .from('users')
            .insert({
                id: user.id,
                email: user.email,
                full_name: user.fullName,
                role: user.role,
                is_verified: user.isVerified
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.mapToDomain(data as DBUser);
    }

    async update(id: string, user: UpdateUserInput): Promise<User> {
        const { data, error } = await supabaseAdmin
            .from('users')
            .update({
                full_name: user.fullName,
                is_verified: user.isVerified,
                role: user.role
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return this.mapToDomain(data as DBUser);
    }

    async verifyUser(id: string, adminId: string): Promise<void> {
        const { error } = await supabaseAdmin
            .from('users')
            .update({
                is_verified: true,
                verified_by: adminId,
                verified_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) throw new Error(error.message);
    }

    private mapToDomain(dbUser: DBUser): User {
        return {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.full_name,
            role: dbUser.role as 'manager' | 'tenant',
            isVerified: dbUser.is_verified ?? false,
            createdAt: dbUser.created_at ?? undefined
        };
    }
}
