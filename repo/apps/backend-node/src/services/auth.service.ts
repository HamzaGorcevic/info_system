import { supabaseAdmin } from "@repo/supabase";
import { supabase } from "@repo/supabase";
import { IUserRepository, IBuildingRepository, RegisterAdminInputDto, LoginInputDto, RegisterTenantInputDto } from "@repo/domain";

export class AuthService {

    async registerAdmin(
        userRepository: IUserRepository,
        input: RegisterAdminInputDto
    ) {
        const { email, password, fullName, buildingName, location, numberApartments } = input;

        const { data: building, error: buildingError } = await supabaseAdmin
            .from('buildings')
            .insert({
                building_name: buildingName,
                location: location,
                number_apartments: numberApartments
            })
            .select()
            .single();

        if (buildingError || !building) {
            throw new Error(`Building creation failed: ${buildingError?.message}`);
        }

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name: fullName,
                role: 'manager'
            }
        });

        if (authError) {
            await supabaseAdmin.from('buildings').delete().eq('id', building.id);
            const error: any = new Error(authError.message);
            error.status = 400;
            throw error;
        }

        const userId = authData.user.id;

        try {
            await userRepository.create({
                id: userId,
                email,
                fullName,
                role: 'manager',
                isVerified: true
            });
        } catch (userError: any) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            await supabaseAdmin.from('buildings').delete().eq('id', building.id);
            throw new Error(userError.message);
        }

        // 4. Link manager to building
        const { error: managerLinkError } = await supabaseAdmin
            .from('building_managers')
            .insert({
                user_id: userId,
                building_id: building.id
            });

        if (managerLinkError) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            await supabaseAdmin.from('buildings').delete().eq('id', building.id);
            throw new Error(managerLinkError.message);
        }

        return {
            user: { id: userId, email, fullName, role: 'manager' },
            building
        };
    }

    async login(input: LoginInputDto) {
        const { email, password } = input;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            throw new Error("Profile not found");
        }

        return {
            session: data.session,
            user: profile
        };
    }

    async registerTenant(input: RegisterTenantInputDto) {
        const { email, password, fullName, buildingId, apartmentNumber } = input;
        console.log(`Registering tenant ${fullName} for building ${buildingId}`);

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (authError) {
            const error: any = new Error(authError.message);
            error.status = 400;
            throw error;
        }

        const userId = authData.user.id;

        const { error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: userId,
                email,
                full_name: fullName,
                role: 'tenant',
                is_verified: false
            });

        if (userError) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            throw new Error(userError.message);
        }

        const { error: tenantError } = await supabaseAdmin
            .from('tenants')
            .insert({
                user_id: userId,
                building_id: buildingId,
                apartment_number: apartmentNumber,
                tenant_number: 1
            });

        if (tenantError) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            throw new Error(tenantError.message);
        }

        return {
            user: { id: userId, email, fullName, role: 'tenant' }
        };
    }

    async getAdminBuildings(
        buildingRepository: IBuildingRepository,
        userId: string
    ) {
        console.log('Fetching buildings for admin:', userId);
        const buildings = await buildingRepository.findBuildingsByManagerId(userId);
        console.log(`Found ${buildings.length} buildings for admin ${userId}`);
        return buildings;
    }
}

export const authService = new AuthService();
