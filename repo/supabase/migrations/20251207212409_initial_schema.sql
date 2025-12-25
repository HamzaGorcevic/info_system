-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BUILDINGS TABLE
-- ============================================
CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location VARCHAR(255) NOT NULL,
    number_apartments INT NOT NULL,
    building_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS TABLE
-- ============================================
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

-- ============================================
-- BUILDING_MANAGERS TABLE
-- ============================================
CREATE TABLE building_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, building_id)
);

CREATE INDEX idx_building_managers_user ON building_managers(user_id);
CREATE INDEX idx_building_managers_building ON building_managers(building_id);

-- ============================================
-- TENANTS TABLE
-- ============================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    tenant_number INT NOT NULL,
    apartment_number INT NOT NULL,
    is_owner BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TENANT_EXPENSES TABLE
-- ============================================
CREATE TABLE tenant_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id),
    expense_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICERS TABLE
-- ============================================
CREATE TABLE servicers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    company_name VARCHAR(255),
    profession VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MALFUNCTIONS TABLE
-- ============================================
CREATE TABLE malfunctions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id),
    servicer_id UUID REFERENCES servicers(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'reported',
    assigned_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INTERVENTIONS TABLE
-- ============================================
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

-- ============================================
-- RATINGS TABLE
-- ============================================
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intervention_id UUID NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    servicer_id UUID NOT NULL REFERENCES servicers(id),
    rated_by UUID NOT NULL REFERENCES users(id),
    rating_score INT NOT NULL CHECK (rating_score >= 1 AND rating_score <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    content VARCHAR(255),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    posted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SUGGESTIONS TABLE
-- ============================================
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

-- ============================================
-- SUGGESTION_VOTES TABLE
-- ============================================
CREATE TABLE suggestion_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    suggestion_id UUID NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
    voted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    document_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- AUDIT_LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GUEST_ACCESS_TOKENS TABLE
-- ============================================
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

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_tenants_building ON tenants(building_id);
CREATE INDEX idx_tenants_user ON tenants(user_id);
CREATE INDEX idx_malfunctions_tenant ON malfunctions(tenant_id);
CREATE INDEX idx_malfunctions_servicer ON malfunctions(servicer_id);
CREATE INDEX idx_interventions_malfunction ON interventions(malfunction_id);
CREATE INDEX idx_messages_building ON messages(building_id);
CREATE INDEX idx_events_building ON events(building_id);
CREATE INDEX idx_suggestions_building ON suggestions(building_id);
CREATE INDEX idx_documents_building ON documents(building_id);
CREATE INDEX idx_guest_tokens_token ON guest_access_tokens(token);
CREATE INDEX idx_guest_tokens_servicer ON guest_access_tokens(servicer_id);
CREATE INDEX idx_guest_tokens_malfunction ON guest_access_tokens(malfunction_id);

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================

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

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- USERS TABLE
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert into users for registration" ON users
    FOR INSERT WITH CHECK (true);

-- BUILDING_MANAGERS TABLE
ALTER TABLE building_managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can view own building assignments" ON building_managers
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Allow insert into building_managers for registration" ON building_managers
    FOR INSERT WITH CHECK (true);

-- TENANTS TABLE
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view their own record" ON tenants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Managers can view all tenants" ON tenants
    FOR SELECT USING (is_manager());

CREATE POLICY "Managers can insert tenants" ON tenants
    FOR INSERT WITH CHECK (is_manager());

CREATE POLICY "Managers can update tenants" ON tenants
    FOR UPDATE USING (is_manager());

CREATE POLICY "Allow insert into tenants for registration" ON tenants
    FOR INSERT WITH CHECK (true);

-- TENANT_EXPENSES TABLE
ALTER TABLE tenant_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their expenses" ON tenant_expenses
    FOR SELECT USING (is_tenant_owner(tenant_id));

CREATE POLICY "Only owners can create expenses" ON tenant_expenses
    FOR INSERT WITH CHECK (is_tenant_owner(tenant_id));

CREATE POLICY "Managers can view all expenses" ON tenant_expenses
    FOR SELECT USING (is_manager());

CREATE POLICY "Managers can create expenses" ON tenant_expenses
    FOR INSERT WITH CHECK (is_manager());

-- SERVICERS TABLE
ALTER TABLE servicers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can manage servicers" ON servicers
    FOR ALL USING (is_manager());

-- MALFUNCTIONS TABLE
ALTER TABLE malfunctions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their malfunctions" ON malfunctions
    FOR SELECT USING (is_tenant_owner(tenant_id));

CREATE POLICY "Only owners can create malfunctions" ON malfunctions
    FOR INSERT WITH CHECK (
        is_tenant_owner(tenant_id) AND 
        reporter_id = auth.uid()
    );

CREATE POLICY "Managers can manage all malfunctions" ON malfunctions
    FOR ALL USING (is_manager());

-- INTERVENTIONS TABLE
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their interventions" ON interventions
    FOR SELECT USING (is_tenant_owner(tenant_id));

CREATE POLICY "Managers can manage all interventions" ON interventions
    FOR ALL USING (is_manager());

-- RATINGS TABLE
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can rate interventions" ON ratings
    FOR INSERT WITH CHECK (rated_by = auth.uid());

CREATE POLICY "Users can view ratings" ON ratings
    FOR SELECT USING (true);

-- MESSAGES TABLE
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

-- SUGGESTIONS TABLE
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view suggestions" ON suggestions
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners and managers can create suggestions" ON suggestions
    FOR INSERT WITH CHECK (
        (EXISTS (SELECT 1 FROM tenants WHERE user_id = auth.uid() AND is_owner = true))
        OR is_manager()
    );

CREATE POLICY "Managers can update suggestions" ON suggestions
    FOR UPDATE USING (is_manager());

-- SUGGESTION_VOTES TABLE
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view votes" ON suggestion_votes
    FOR SELECT USING (true);

CREATE POLICY "Only owners can vote" ON suggestion_votes
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM tenants WHERE user_id = auth.uid() AND is_owner = true)
        AND voted_by = auth.uid()
    );

-- EVENTS TABLE
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view events" ON events
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only managers can create events" ON events
    FOR INSERT WITH CHECK (is_manager());

CREATE POLICY "Managers can update events" ON events
    FOR UPDATE USING (is_manager());

-- DOCUMENTS TABLE
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users in building can view documents" ON documents
    FOR SELECT USING (
        building_id IN (
            SELECT building_id FROM tenants WHERE user_id = auth.uid()
            UNION
            SELECT building_id FROM building_managers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Only managers can upload documents" ON documents
    FOR INSERT WITH CHECK (is_manager());

-- AUDIT_LOGS TABLE
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only managers can view audit logs" ON audit_logs
    FOR SELECT USING (is_manager());

-- GUEST_ACCESS_TOKENS TABLE
ALTER TABLE guest_access_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can manage guest tokens" ON guest_access_tokens
    FOR ALL USING (is_manager());