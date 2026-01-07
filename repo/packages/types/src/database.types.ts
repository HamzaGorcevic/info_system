export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      building_managers: {
        Row: {
          building_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          building_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          building_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "building_managers_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "building_managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          building_name: string | null
          created_at: string | null
          id: string
          location: string
          number_apartments: number
        }
        Insert: {
          building_name?: string | null
          created_at?: string | null
          id?: string
          location: string
          number_apartments: number
        }
        Update: {
          building_name?: string | null
          created_at?: string | null
          id?: string
          location?: string
          number_apartments?: number
        }
        Relationships: []
      }
      documents: {
        Row: {
          building_id: string | null
          created_at: string | null
          document_type: string | null
          file_url: string
          id: string
          title: string
          uploaded_by: string
        }
        Insert: {
          building_id?: string | null
          created_at?: string | null
          document_type?: string | null
          file_url: string
          id?: string
          title: string
          uploaded_by: string
        }
        Update: {
          building_id?: string | null
          created_at?: string | null
          document_type?: string | null
          file_url?: string
          id?: string
          title?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          building_id: string | null
          content: string | null
          created_at: string | null
          created_by: string
          id: string
          scheduled_at: string
          title: string
        }
        Insert: {
          building_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          scheduled_at: string
          title: string
        }
        Update: {
          building_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          scheduled_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_access_tokens: {
        Row: {
          building_id: string
          created_at: string | null
          expires_at: string
          granted_by: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          malfunction_id: string
          servicer_id: string
          token: string
        }
        Insert: {
          building_id: string
          created_at?: string | null
          expires_at: string
          granted_by: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          malfunction_id: string
          servicer_id: string
          token: string
        }
        Update: {
          building_id?: string
          created_at?: string | null
          expires_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          malfunction_id?: string
          servicer_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_access_tokens_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_access_tokens_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_access_tokens_malfunction_id_fkey"
            columns: ["malfunction_id"]
            isOneToOne: false
            referencedRelation: "malfunctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_access_tokens_servicer_id_fkey"
            columns: ["servicer_id"]
            isOneToOne: false
            referencedRelation: "servicers"
            referencedColumns: ["id"]
          },
        ]
      }
      interventions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          malfunction_id: string
          notes: string | null
          scheduled_at: string | null
          servicer_id: string
          started_at: string | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          malfunction_id: string
          notes?: string | null
          scheduled_at?: string | null
          servicer_id: string
          started_at?: string | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          malfunction_id?: string
          notes?: string | null
          scheduled_at?: string | null
          servicer_id?: string
          started_at?: string | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interventions_malfunction_id_fkey"
            columns: ["malfunction_id"]
            isOneToOne: false
            referencedRelation: "malfunctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_servicer_id_fkey"
            columns: ["servicer_id"]
            isOneToOne: false
            referencedRelation: "servicers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interventions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      malfunctions: {
        Row: {
          assigned_at: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          reporter_id: string
          resolved_at: string | null
          servicer_id: string | null
          started_at: string | null
          status: string | null
          tenant_id: string
          title: string
        }
        Insert: {
          assigned_at?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          reporter_id: string
          resolved_at?: string | null
          servicer_id?: string | null
          started_at?: string | null
          status?: string | null
          tenant_id: string
          title: string
        }
        Update: {
          assigned_at?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          reporter_id?: string
          resolved_at?: string | null
          servicer_id?: string | null
          started_at?: string | null
          status?: string | null
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "malfunctions_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "malfunctions_servicer_id_fkey"
            columns: ["servicer_id"]
            isOneToOne: false
            referencedRelation: "servicers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "malfunctions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          building_id: string | null
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          posted_by: string
        }
        Insert: {
          building_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          posted_by: string
        }
        Update: {
          building_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          posted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          intervention_id: string
          rated_by: string
          rating_score: number
          servicer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          intervention_id: string
          rated_by: string
          rating_score: number
          servicer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          intervention_id?: string
          rated_by?: string
          rating_score?: number
          servicer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_intervention_id_fkey"
            columns: ["intervention_id"]
            isOneToOne: false
            referencedRelation: "interventions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_by_fkey"
            columns: ["rated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_servicer_id_fkey"
            columns: ["servicer_id"]
            isOneToOne: false
            referencedRelation: "servicers"
            referencedColumns: ["id"]
          },
        ]
      }
      servicers: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string
          profession: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone: string
          profession: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          profession?: string
        }
        Relationships: []
      }
      suggestion_votes: {
        Row: {
          created_at: string | null
          id: string
          suggestion_id: string
          vote: boolean | null
          voted_by: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          suggestion_id: string
          vote?: boolean | null
          voted_by: string
        }
        Update: {
          created_at?: string | null
          id?: string
          suggestion_id?: string
          vote?: boolean | null
          voted_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_votes_voted_by_fkey"
            columns: ["voted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          building_id: string | null
          content: string
          created_at: string | null
          created_by: string
          id: string
          percentage_of_votes: number | null
          status: string | null
          title: string
        }
        Insert: {
          building_id?: string | null
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          percentage_of_votes?: number | null
          status?: string | null
          title: string
        }
        Update: {
          building_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          percentage_of_votes?: number | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_expenses: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string
          description: string | null
          expense_type: string
          id: string
          status: string
          paid_at: string | null
          tenant_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by: string
          description?: string | null
          expense_type: string
          id?: string
          status?: string
          paid_at?: string | null
          tenant_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string
          description?: string | null
          expense_type?: string
          id?: string
          status?: string
          paid_at?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_expenses_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          apartment_number: number
          building_id: string
          created_at: string | null
          id: string
          is_owner: boolean | null
          tenant_number: number
          user_id: string
        }
        Insert: {
          apartment_number: number
          building_id: string
          created_at?: string | null
          id?: string
          is_owner?: boolean | null
          tenant_number: number
          user_id: string
        }
        Update: {
          apartment_number?: number
          building_id?: string
          created_at?: string | null
          id?: string
          is_owner?: boolean | null
          tenant_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          role: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          role: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          role?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_manager: { Args: never; Returns: boolean }
      is_manager_of_building: {
        Args: { building_id_param: string }
        Returns: boolean
      }
      is_tenant_owner: { Args: { tenant_id_param: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

