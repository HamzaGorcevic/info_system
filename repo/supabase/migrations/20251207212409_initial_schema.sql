-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLES DEFINITIONS
-- ============================================

-- BUILDINGS
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(255) NOT NULL,
    number_apartments INT NOT NULL,
    building_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('tenant', 'manager', 'household_member')),
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BUILDING_MANAGERS
CREATE TABLE building_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, building_id)
);

CREATE INDEX idx_building_managers_user ON building_managers(user_id);
CREATE INDEX idx_building_managers_building ON building_managers(building_id);

-- TENANTS
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    tenant_number INT NOT NULL,
    apartment_number INT NOT NULL,
    is_owner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tenants_building ON tenants(building_id);
CREATE INDEX idx_tenants_user ON tenants(user_id);

-- TENANT_EXPENSES
CREATE TABLE tenant_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    expense_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SERVICERS
CREATE TABLE servicers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company_name VARCHAR(255),
    profession VARCHAR(100) NOT NULL,
    created_by UUID REFERENCES users(id), -- Added created_by for RLS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MALFUNCTIONS
CREATE TABLE malfunctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id),
    servicer_id UUID REFERENCES servicers(id),
    image_url VARCHAR(250),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'reported',
    assigned_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_malfunctions_tenant ON malfunctions(tenant_id);
CREATE INDEX idx_malfunctions_servicer ON malfunctions(servicer_id);

-- INTERVENTIONS
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    malfunction_id UUID NOT NULL REFERENCES malfunctions(id) ON DELETE CASCADE,
    servicer_id UUID NOT NULL REFERENCES servicers(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_interventions_malfunction ON interventions(malfunction_id);

-- RATINGS
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_id UUID NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    servicer_id UUID NOT NULL REFERENCES servicers(id),
    rated_by UUID NOT NULL REFERENCES users(id),
    rating_score INT NOT NULL CHECK (rating_score >= 1 AND rating_score <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EVENTS
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    content VARCHAR(255),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_building ON events(building_id);

-- MESSAGES
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    posted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_building ON messages(building_id);

-- SUGGESTIONS
CREATE TABLE suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    percentage_of_votes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_suggestions_building ON suggestions(building_id);

-- SUGGESTION_VOTES
CREATE TABLE suggestion_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suggestion_id UUID NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
    voted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    document_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_building ON documents(building_id);

-- AUDIT_LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GUEST_ACCESS_TOKENS
CREATE TABLE guest_access_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    servicer_id UUID NOT NULL REFERENCES servicers(id) ON DELETE CASCADE,
    malfunction_id UUID NOT NULL REFERENCES malfunctions(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    granted_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guest_tokens_token ON guest_access_tokens(token);
CREATE INDEX idx_guest_tokens_servicer ON guest_access_tokens(servicer_id);
CREATE INDEX idx_guest_tokens_malfunction ON guest_access_tokens(malfunction_id);

-- ============================================
-- 2. HELPER FUNCTIONS
-- ============================================

-- Check if user is a manager (Security Definer to avoid recursion)
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'manager'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if manager manages a specific building
CREATE OR REPLACE FUNCTION is_manager_of_building(building_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM building_managers 
        WHERE user_id = auth.uid() 
        AND building_id = building_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is the OWNER of the tenant record
CREATE OR REPLACE FUNCTION is_tenant_owner(tenant_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenants 
        WHERE id = tenant_id_param 
        AND user_id = auth.uid() 
        AND is_owner = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is ANY MEMBER (Owner or Tenant) of the tenant record
CREATE OR REPLACE FUNCTION is_household_member(tenant_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenants 
        WHERE id = tenant_id_param 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is a tenant in a specific building
CREATE OR REPLACE FUNCTION is_tenant_in_building(building_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM tenants 
        WHERE user_id = auth.uid() 
        AND building_id = building_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure Token Verification RPC (Returns token + malfunction details)
CREATE OR REPLACE FUNCTION verify_guest_token(token_param TEXT)
RETURNS TABLE (
    id UUID,
    token VARCHAR,
    servicer_id UUID,
    malfunction_id UUID,
    building_id UUID,
    granted_by UUID,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    malfunctions JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.token,
        t.servicer_id,
        t.malfunction_id,
        t.building_id,
        t.granted_by,
        t.expires_at,
        t.is_active,
        t.last_used_at,
        t.created_at,
        to_jsonb(m.*) as malfunctions
    FROM guest_access_tokens t
    JOIN malfunctions m ON t.malfunction_id = m.id
    WHERE t.token = token_param
    AND t.is_active = true
    AND t.expires_at > now();
END;
$$;

-- ============================================
-- 3. RLS POLICIES
-- ============================================

-- USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Fix: Allow managers to view all users (to see tenants)
CREATE POLICY "Managers can view all users" ON users
    FOR SELECT USING (is_manager());

-- Fix: Allow managers to update users (to verify tenants)
CREATE POLICY "Managers can update users" ON users
    FOR UPDATE USING (is_manager());

CREATE POLICY "Allow insert into users for registration" ON users
    FOR INSERT WITH CHECK (true);

-- BUILDING_MANAGERS
ALTER TABLE building_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view own building assignments" ON building_managers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Allow insert into building_managers for registration" ON building_managers
    FOR INSERT WITH CHECK (true);

-- TENANTS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view own record" ON tenants
    FOR SELECT USING (user_id = auth.uid());

-- Fix: Managers can only view tenants in THEIR buildings
CREATE POLICY "Managers can view building tenants" ON tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM building_managers bm
            WHERE bm.building_id = tenants.building_id
            AND bm.user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can insert building tenants" ON tenants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM building_managers bm
            WHERE bm.building_id = tenants.building_id
            AND bm.user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can update building tenants" ON tenants
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM building_managers bm
            WHERE bm.building_id = tenants.building_id
            AND bm.user_id = auth.uid()
        )
    );

CREATE POLICY "Allow insert into tenants for registration" ON tenants
    FOR INSERT WITH CHECK (true);

-- TENANT_EXPENSES
ALTER TABLE tenant_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their expenses" ON tenant_expenses
    FOR SELECT USING (is_tenant_owner(tenant_id));

CREATE POLICY "Only owners can create expenses" ON tenant_expenses
    FOR INSERT WITH CHECK (is_tenant_owner(tenant_id));

CREATE POLICY "Managers can view all expenses" ON tenant_expenses
    FOR SELECT USING (is_manager());

CREATE POLICY "Managers can create expenses" ON tenant_expenses
    FOR INSERT WITH CHECK (is_manager());

-- SERVICERS
ALTER TABLE servicers ENABLE ROW LEVEL SECURITY;

-- Fix: Managers can only manage servicers they created
CREATE POLICY "Managers can manage own servicers" ON servicers
    FOR ALL USING (created_by = auth.uid());

CREATE POLICY "Managers can insert own servicers" ON servicers
    FOR INSERT WITH CHECK (created_by = auth.uid());

-- MALFUNCTIONS
ALTER TABLE malfunctions ENABLE ROW LEVEL SECURITY;

-- Fix: Tenants (household members) can view their own malfunctions
CREATE POLICY "Tenants can view own malfunctions" ON malfunctions
    FOR SELECT USING (is_household_member(tenant_id));

CREATE POLICY "Only owners can create malfunctions" ON malfunctions
    FOR INSERT WITH CHECK (
        is_household_member(tenant_id) AND -- Changed to household member for now per request
        reporter_id = auth.uid()
    );

-- Fix: Managers can only manage malfunctions in THEIR buildings
CREATE POLICY "Managers can manage building malfunctions" ON malfunctions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tenants t
            JOIN building_managers bm ON t.building_id = bm.building_id
            WHERE t.id = malfunctions.tenant_id
            AND bm.user_id = auth.uid()
        )
    );

-- Fix: Allow public update via valid token (Strict)
CREATE POLICY "Public can update malfunction status with valid token"
ON malfunctions
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM guest_access_tokens
        WHERE guest_access_tokens.token = current_setting('request.guest_token', true)
        AND guest_access_tokens.malfunction_id = malfunctions.id
        AND guest_access_tokens.is_active = true
        AND guest_access_tokens.expires_at > now()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM guest_access_tokens
        WHERE guest_access_tokens.token = current_setting('request.guest_token', true)
        AND guest_access_tokens.malfunction_id = malfunctions.id
        AND guest_access_tokens.is_active = true
        AND guest_access_tokens.expires_at > now()
    )
);

-- INTERVENTIONS
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- Fix: Tenants can view own interventions
CREATE POLICY "Tenants can view own interventions" ON interventions
    FOR SELECT USING (is_household_member(tenant_id));

-- Fix: Managers can only manage interventions in THEIR buildings
CREATE POLICY "Managers can manage building interventions" ON interventions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tenants t
            JOIN building_managers bm ON t.building_id = bm.building_id
            WHERE t.id = interventions.tenant_id
            AND bm.user_id = auth.uid()
        )
    );

-- RATINGS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can rate interventions" ON ratings
    FOR INSERT WITH CHECK (rated_by = auth.uid());

CREATE POLICY "Users can view ratings" ON ratings
    FOR SELECT USING (true);

-- MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view messages" ON messages
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners and managers can post messages" ON messages
    FOR INSERT WITH CHECK (
        (EXISTS (SELECT 1 FROM tenants WHERE user_id = auth.uid() AND is_owner = true))
        OR is_manager()
    );

-- SUGGESTIONS
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view suggestions" ON suggestions
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Tenants and Managers can create suggestions" ON suggestions
    FOR INSERT WITH CHECK (
        is_tenant_in_building(building_id)
        OR is_manager_of_building(building_id)
    );

CREATE POLICY "Managers can update suggestions" ON suggestions
    FOR UPDATE USING (is_manager());

CREATE POLICY "Managers can delete suggestions" ON suggestions
    FOR DELETE USING (is_manager_of_building(building_id));

-- SUGGESTION_VOTES
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view votes" ON suggestion_votes
    FOR SELECT USING (true);

CREATE POLICY "Tenants can vote" ON suggestion_votes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM suggestions s
            WHERE s.id = suggestion_id
            AND is_tenant_in_building(s.building_id)
            AND s.created_by != auth.uid()
        )
        AND voted_by = auth.uid()
    );

CREATE POLICY "Tenants can delete their vote" ON suggestion_votes
    FOR DELETE USING (
        voted_by = auth.uid()
    );

CREATE POLICY "Tenants can update their vote" ON suggestion_votes
    FOR UPDATE USING (
        voted_by = auth.uid()
    );

-- EVENTS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view events" ON events
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

-- Fix: Managers can only create events for THEIR buildings
CREATE POLICY "Managers can create events for own buildings" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM building_managers bm
            WHERE bm.building_id = events.building_id
            AND bm.user_id = auth.uid()
        )
    );

CREATE POLICY "Managers can update events for own buildings" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM building_managers bm
            WHERE bm.building_id = events.building_id
            AND bm.user_id = auth.uid()
        )
    );

-- DOCUMENTS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view documents" ON documents
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

-- Fix: Managers can only upload documents to THEIR buildings
CREATE POLICY "Managers can upload documents to own buildings" ON documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM building_managers bm
            WHERE bm.building_id = documents.building_id
            AND bm.user_id = auth.uid()
        )
    );

-- AUDIT_LOGS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only managers can view audit logs" ON audit_logs
    FOR SELECT USING (is_manager());

-- GUEST_ACCESS_TOKENS
ALTER TABLE guest_access_tokens ENABLE ROW LEVEL SECURITY;

-- Fix: Managers can only manage tokens THEY granted
CREATE POLICY "Managers can manage own tokens" ON guest_access_tokens
    FOR ALL USING (granted_by = auth.uid());

-- Note: Public access is handled via RPC verify_guest_token(), so no SELECT policy needed here.