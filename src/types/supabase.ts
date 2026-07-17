/**
 * Supabase Database Types
 * Auto-generated from the Supabase schema.
 * This defines the shape of all tables in the database.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          role_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          role_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          role_id?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_system: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_system?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_system?: boolean;
          created_at?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          role_id: string;
          resource: string;
          action: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          role_id: string;
          resource: string;
          action: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          role_id?: string;
          resource?: string;
          action?: string;
          created_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: string;
          content: string;
          excerpt: string | null;
          featured_image: string | null;
          gallery_images: string[] | null;
          tags: string[] | null;
          author_id: string | null;
          status: string;
          publish_date: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: string;
          content: string;
          excerpt?: string | null;
          featured_image?: string | null;
          gallery_images?: string[] | null;
          tags?: string[] | null;
          author_id?: string | null;
          status?: string;
          publish_date?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          category?: string;
          content?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          gallery_images?: string[] | null;
          tags?: string[] | null;
          author_id?: string | null;
          status?: string;
          publish_date?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      news_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      gallery: {
        Row: {
          id: string;
          album_id: string | null;
          image_url: string;
          caption: string | null;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id?: string | null;
          image_url: string;
          caption?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string | null;
          image_url?: string;
          caption?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      albums: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          photo_url: string | null;
          name: string;
          position: string;
          department_id: string | null;
          biography: string | null;
          email: string | null;
          phone: string | null;
          linkedin: string | null;
          facebook: string | null;
          x: string | null;
          instagram: string | null;
          status: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          photo_url?: string | null;
          name: string;
          position: string;
          department_id?: string | null;
          biography?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          facebook?: string | null;
          x?: string | null;
          instagram?: string | null;
          status?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          photo_url?: string | null;
          name?: string;
          position?: string;
          department_id?: string | null;
          biography?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin?: string | null;
          facebook?: string | null;
          x?: string | null;
          instagram?: string | null;
          status?: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          county: string | null;
          description: string | null;
          objectives: string[] | null;
          budget: number | null;
          funding_partner: string | null;
          start_date: string | null;
          end_date: string | null;
          progress_percentage: number;
          status: string;
          project_images: string[] | null;
          documents: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          county?: string | null;
          description?: string | null;
          objectives?: string[] | null;
          budget?: number | null;
          funding_partner?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          progress_percentage?: number;
          status?: string;
          project_images?: string[] | null;
          documents?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          county?: string | null;
          description?: string | null;
          objectives?: string[] | null;
          budget?: number | null;
          funding_partner?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          progress_percentage?: number;
          status?: string;
          project_images?: string[] | null;
          documents?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          poster_url: string | null;
          title: string;
          venue: string | null;
          event_date: string;
          event_time: string | null;
          description: string | null;
          registration_link: string | null;
          google_map_url: string | null;
          capacity: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          poster_url?: string | null;
          title: string;
          venue?: string | null;
          event_date: string;
          event_time?: string | null;
          description?: string | null;
          registration_link?: string | null;
          google_map_url?: string | null;
          capacity?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          poster_url?: string | null;
          title?: string;
          venue?: string | null;
          event_date?: string;
          event_time?: string | null;
          description?: string | null;
          registration_link?: string | null;
          google_map_url?: string | null;
          capacity?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category_id: string | null;
          file_url: string;
          file_type: string;
          file_size: number;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category_id?: string | null;
          file_url: string;
          file_type: string;
          file_size: number;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category_id?: string | null;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      document_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      volunteers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          county: string;
          skills: string | null;
          availability: string | null;
          motivation: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          county: string;
          skills?: string | null;
          availability?: string | null;
          motivation?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          county?: string;
          skills?: string | null;
          availability?: string | null;
          motivation?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          transaction_id: string;
          donor_name: string;
          email: string;
          phone: string;
          amount: number;
          payment_method: string;
          status: string;
          is_recurring: boolean;
          campaign_id: string | null;
          message: string | null;
          mpesa_receipt_number: string | null;
          mpesa_checkout_request_id: string | null;
          merchant_request_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          donor_name: string;
          email: string;
          phone: string;
          amount: number;
          payment_method: string;
          status?: string;
          is_recurring?: boolean;
          campaign_id?: string | null;
          message?: string | null;
          mpesa_receipt_number?: string | null;
          mpesa_checkout_request_id?: string | null;
          merchant_request_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          donor_name?: string;
          email?: string;
          phone?: string;
          amount?: number;
          payment_method?: string;
          status?: string;
          is_recurring?: boolean;
          campaign_id?: string | null;
          message?: string | null;
          mpesa_receipt_number?: string | null;
          mpesa_checkout_request_id?: string | null;
          merchant_request_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          organization: string | null;
          subject: string;
          message: string;
          inquiry_type: string;
          status: string;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          organization?: string | null;
          subject: string;
          message: string;
          inquiry_type?: string;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          organization?: string | null;
          subject?: string;
          message?: string;
          inquiry_type?: string;
          status?: string;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          is_active: boolean;
          subscribed_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          is_active?: boolean;
          subscribed_at?: string;
        };
      };
      media_library: {
        Row: {
          id: string;
          name: string;
          url: string;
          type: string;
          size: number;
          folder: string | null;
          alt_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          url: string;
          type: string;
          size: number;
          folder?: string | null;
          alt_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          url?: string;
          type?: string;
          size?: number;
          folder?: string | null;
          alt_text?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource: string;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource?: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types for common operations
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];