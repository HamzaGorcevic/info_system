export interface Malfunction {
    id: string;
    tenant_id: string;
    reporter_id: string;
    servicer_id?: string | null;
    image_url?: string | null;
    title: string;
    description: string;
    category?: string | null;
    status: 'reported' | 'assigned' | 'in_progress' | 'resolved';
    assigned_at?: string | null;
    started_at?: string | null;
    resolved_at?: string | null;
    created_at?: string;
    ratings?: Rating[];
}

export interface Rating {
    id: string;
    rated_by: string;
    rating_score: number;
    comment?: string;
    created_at: string;
}

export interface Servicer {
    id: string;
    full_name: string;
    phone: string;
    email?: string | null;
    company_name?: string | null;
    profession: string;
    created_at?: string;
    ratings?: Rating[];
}

export interface TenantData {
    id: string;
    user_id: string;
    building_id: string;
    apartment_number: string;
    is_owner: boolean;
    buildings?: {
        id: string;
        building_name: string;
        address: string;
    };
}
