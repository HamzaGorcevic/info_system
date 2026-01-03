import { supabaseAdmin, supabase } from "@repo/supabase";
export class UserRepository {
    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data)
            return null;
        return this.mapToDomain(data);
    }
    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();
        if (error || !data)
            return null;
        return this.mapToDomain(data);
    }
    async create(user) {
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
        if (error)
            throw new Error(error.message);
        return this.mapToDomain(data);
    }
    async update(id, user) {
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
        if (error)
            throw new Error(error.message);
        return this.mapToDomain(data);
    }
    async verifyUser(id, adminId) {
        const { error } = await supabaseAdmin
            .from('users')
            .update({
            is_verified: true,
            verified_by: adminId,
            verified_at: new Date().toISOString()
        })
            .eq('id', id);
        if (error)
            throw new Error(error.message);
    }
    mapToDomain(dbUser) {
        return {
            id: dbUser.id,
            email: dbUser.email,
            fullName: dbUser.full_name,
            role: dbUser.role,
            isVerified: dbUser.is_verified ?? false,
            createdAt: dbUser.created_at ?? undefined
        };
    }
}
