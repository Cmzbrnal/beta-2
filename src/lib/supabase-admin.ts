import { createClient } from '@supabase/supabase-js';

export type Database = {
    public: {
        Tables: {
            content_entries: {
                Row: {
                    id: string;
                    member_code: string;
                    project: string;
                    content: Record<string, string>;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    member_code: string;
                    project: string;
                    content?: Record<string, string>;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['content_entries']['Insert']>;
                Relationships: [];
            };
            content_files: {
                Row: {
                    id: string;
                    member_code: string;
                    project: string;
                    name: string;
                    mime_type: string;
                    storage_path: string;
                    public_url: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    member_code: string;
                    project: string;
                    name: string;
                    mime_type: string;
                    storage_path: string;
                    public_url: string;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['content_files']['Insert']>;
                Relationships: [];
            };
            content_entities: {
                Row: {
                    id: string;
                    section: 'biblioteca' | 'eventos' | 'capacitaciones';
                    title: string;
                    description: string;
                    content: Record<string, unknown>;
                    status: 'draft' | 'published';
                    created_by: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    section: 'biblioteca' | 'eventos' | 'capacitaciones';
                    title: string;
                    description?: string;
                    content?: Record<string, unknown>;
                    status?: 'draft' | 'published';
                    created_by: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['content_entities']['Insert']>;
                Relationships: [];
            };
            content_entity_files: {
                Row: {
                    id: string;
                    entity_id: string;
                    member_code: string;
                    name: string;
                    mime_type: string;
                    storage_path: string;
                    public_url: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    entity_id: string;
                    member_code: string;
                    name: string;
                    mime_type: string;
                    storage_path: string;
                    public_url: string;
                    created_at?: string;
                };
                Update: Partial<Database['public']['Tables']['content_entity_files']['Insert']>;
                Relationships: [];
            };
            projects: {
                Row: {
                    id: string;
                    title: string;
                    description: string;
                    image_url: string;
                    content: Record<string, unknown>;
                    status: 'draft' | 'published';
                    created_by: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description: string;
                    image_url: string;
                    content?: Record<string, unknown>;
                    status?: 'draft' | 'published';
                    created_by: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['projects']['Insert']>;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseAdmin() {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
        throw new Error('Supabase no está configurado. Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.');
    }

    if (!client) {
        client = createClient<Database>(url, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });
    }

    return client;
}

export const SUPABASE_CONTENT_BUCKET = 'contenido-publico';
