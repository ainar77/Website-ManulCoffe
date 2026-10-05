/**
 * Supabase database types used by the ManulCoffee application.
 */

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string;
          customer_name: string;
          email: string;
          phone: string;
          location: string;
          reservation_date: string;
          reservation_time: string;
          guests: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          email: string;
          phone: string;
          location: string;
          reservation_date: string;
          reservation_time: string;
          guests: number;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          location?: string;
          reservation_date?: string;
          reservation_time?: string;
          guests?: number;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      menu_items: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          price: number;
          category: string;
          subcategory: string | null;
          dietary_tags: string[];
          is_available: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          price: number;
          category: string;
          subcategory?: string | null;
          dietary_tags?: string[];
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          price?: number;
          category?: string;
          subcategory?: string | null;
          dietary_tags?: string[];
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      business_settings: {
        Row: {
          id: number;
          business_name: string;
          tagline: string | null;
          tagline_lv: string | null;
          description: string | null;
          description_lv: string | null;
          contact_email: string | null;
          phone: string | null;
          website_url: string | null;
          instagram_url: string | null;
          currency: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          business_name: string;
          tagline?: string | null;
          tagline_lv?: string | null;
          description?: string | null;
          description_lv?: string | null;
          contact_email?: string | null;
          phone?: string | null;
          website_url?: string | null;
          instagram_url?: string | null;
          currency?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          business_name?: string;
          tagline?: string | null;
          tagline_lv?: string | null;
          description?: string | null;
          description_lv?: string | null;
          contact_email?: string | null;
          phone?: string | null;
          website_url?: string | null;
          instagram_url?: string | null;
          currency?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      business_locations: {
        Row: {
          id: number;
          name: string;
          address: string;
          city: string | null;
          postal_code: string | null;
          phone: string | null;
          maps_url: string | null;
          description: string | null;
          map_embed_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          address: string;
          city?: string | null;
          postal_code?: string | null;
          phone?: string | null;
          maps_url?: string | null;
          description?: string | null;
          map_embed_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          address?: string;
          city?: string | null;
          postal_code?: string | null;
          phone?: string | null;
          maps_url?: string | null;
          description?: string | null;
          map_embed_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      business_hours: {
        Row: {
          id: number;
          location_id: number;
          day_of_week: number;
          open_time: string | null;
          close_time: string | null;
          is_closed: boolean;
        };
        Insert: {
          id?: number;
          location_id: number;
          day_of_week: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
        Update: {
          id?: number;
          location_id?: number;
          day_of_week?: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "business_hours_location_id_fkey";
            columns: ["location_id"];
            isOneToOne: false;
            referencedRelation: "business_locations";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: Record<string, never>;

    Functions: {
      get_unavailable_reservation_times: {
        Args: {
          p_location: string;
          p_date: string;
        };
        Returns: {
          reservation_time: string;
        }[];
      };
    };

    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
