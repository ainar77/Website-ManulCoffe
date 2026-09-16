/**
 * Supabase database types for the connected external project.
 *
 * Only the `public.reservations` table used by the app is typed here.
 * Regenerate with `supabase gen types typescript` for full coverage.
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
