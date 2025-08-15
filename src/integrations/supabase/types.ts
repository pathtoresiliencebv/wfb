export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          reason: string | null
          scheduled_for: string
          status: string
          user_id: string
          verification_token: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          scheduled_for: string
          status?: string
          user_id: string
          verification_token: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          scheduled_for?: string
          status?: string
          user_id?: string
          verification_token?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string
          created_at: string
          criteria: Json
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          points: number
          rarity: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          criteria?: Json
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          points?: number
          rarity?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          criteria?: Json
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          points?: number
          rarity?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_feed: {
        Row: {
          activity_data: Json
          activity_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          activity_data?: Json
          activity_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          activity_data?: Json
          activity_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          color: string | null
          created_at: string
          criteria: Json | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          reply_count: number | null
          slug: string
          sort_order: number | null
          topic_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          reply_count?: number | null
          slug: string
          sort_order?: number | null
          topic_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          reply_count?: number | null
          slug?: string
          sort_order?: number | null
          topic_count?: number | null
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      data_export_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          expires_at: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          request_type: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          request_type: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          expires_at?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          request_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          alt_text: string | null
          created_at: string
          file_size: number
          filename: string
          height: number | null
          id: string
          mime_type: string
          original_name: string
          storage_path: string
          user_id: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_size: number
          filename: string
          height?: number | null
          id?: string
          mime_type: string
          original_name: string
          storage_path: string
          user_id: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_size?: number
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string
          original_name?: string
          storage_path?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      level_definitions: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          level_number: number
          perks: Json | null
          required_xp: number
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level_number: number
          perks?: Json | null
          required_xp: number
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          level_number?: number
          perks?: Json | null
          required_xp?: number
          title?: string
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempt_count: number
          created_at: string
          email: string
          id: string
          ip_address: unknown
          last_attempt_at: string
          locked_until: string | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          email: string
          id?: string
          ip_address: unknown
          last_attempt_at?: string
          locked_until?: string | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          email?: string
          id?: string
          ip_address?: unknown
          last_attempt_at?: string
          locked_until?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string | null
          read_at: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string | null
          read_at?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      point_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_verified: boolean | null
          reputation: number | null
          role: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          reputation?: number | null
          role?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          reputation?: number | null
          role?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_solution: boolean | null
          parent_id: string | null
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          parent_id?: string | null
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_solution?: boolean | null
          parent_id?: string | null
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          reason: string
          reported_item_id: string
          reported_item_type: string
          reporter_id: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reported_item_id: string
          reported_item_type: string
          reporter_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_item_id?: string
          reported_item_type?: string
          reporter_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: []
      }
      reputation_history: {
        Row: {
          change_amount: number
          created_at: string
          id: string
          reason: string
          related_item_id: string | null
          related_item_type: string | null
          user_id: string
        }
        Insert: {
          change_amount: number
          created_at?: string
          id?: string
          reason: string
          related_item_id?: string | null
          related_item_type?: string | null
          user_id: string
        }
        Update: {
          change_amount?: number
          created_at?: string
          id?: string
          reason?: string
          related_item_id?: string | null
          related_item_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          cost_category_id: string | null
          cost_points: number
          created_at: string
          current_claims: number | null
          description: string | null
          expires_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_limited: boolean | null
          max_claims: number | null
          name: string
          required_level: number | null
          reward_type: string
        }
        Insert: {
          cost_category_id?: string | null
          cost_points?: number
          created_at?: string
          current_claims?: number | null
          description?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_limited?: boolean | null
          max_claims?: number | null
          name: string
          required_level?: number | null
          reward_type: string
        }
        Update: {
          cost_category_id?: string | null
          cost_points?: number
          created_at?: string
          current_claims?: number | null
          description?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_limited?: boolean | null
          max_claims?: number | null
          name?: string
          required_level?: number | null
          reward_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_cost_category_id_fkey"
            columns: ["cost_category_id"]
            isOneToOne: false
            referencedRelation: "point_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_categories: {
        Row: {
          category_pricing: Json | null
          created_at: string | null
          description: string | null
          description_lines: Json | null
          id: string
          is_active: boolean | null
          name: string
          product_count: number | null
          sort_order: number | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          category_pricing?: Json | null
          created_at?: string | null
          description?: string | null
          description_lines?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          product_count?: number | null
          sort_order?: number | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          category_pricing?: Json | null
          created_at?: string | null
          description?: string | null
          description_lines?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          product_count?: number | null
          sort_order?: number | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_categories_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_menu_items: {
        Row: {
          category: string | null
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          is_available: boolean
          name: string
          position: number
          price: number
          pricing_tiers: Json | null
          supplier_id: string
          tags: string[] | null
          unit: string | null
          updated_at: string
          use_category_pricing: boolean | null
          weight_options: string[] | null
        }
        Insert: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_available?: boolean
          name: string
          position?: number
          price?: number
          pricing_tiers?: Json | null
          supplier_id: string
          tags?: string[] | null
          unit?: string | null
          updated_at?: string
          use_category_pricing?: boolean | null
          weight_options?: string[] | null
        }
        Update: {
          category?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          is_available?: boolean
          name?: string
          position?: number
          price?: number
          pricing_tiers?: Json | null
          supplier_id?: string
          tags?: string[] | null
          unit?: string | null
          updated_at?: string
          use_category_pricing?: boolean | null
          weight_options?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_supplier_menu_supplier"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "supplier_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_profiles: {
        Row: {
          banner_image: string | null
          business_name: string
          contact_description: string | null
          contact_info: Json | null
          created_at: string
          delivery_areas: string[] | null
          delivery_fee: number | null
          description: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          logo_image: string | null
          minimum_order: number | null
          opening_hours: Json | null
          ordering_process_descriptions: Json | null
          product_name: string | null
          ranking: number | null
          stats: Json | null
          theme_color: string | null
          updated_at: string
          user_id: string
          why_choose_us: string[] | null
          why_choose_us_descriptions: Json | null
        }
        Insert: {
          banner_image?: string | null
          business_name: string
          contact_description?: string | null
          contact_info?: Json | null
          created_at?: string
          delivery_areas?: string[] | null
          delivery_fee?: number | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          logo_image?: string | null
          minimum_order?: number | null
          opening_hours?: Json | null
          ordering_process_descriptions?: Json | null
          product_name?: string | null
          ranking?: number | null
          stats?: Json | null
          theme_color?: string | null
          updated_at?: string
          user_id: string
          why_choose_us?: string[] | null
          why_choose_us_descriptions?: Json | null
        }
        Update: {
          banner_image?: string | null
          business_name?: string
          contact_description?: string | null
          contact_info?: Json | null
          created_at?: string
          delivery_areas?: string[] | null
          delivery_fee?: number | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          logo_image?: string | null
          minimum_order?: number | null
          opening_hours?: Json | null
          ordering_process_descriptions?: Json | null
          product_name?: string | null
          ranking?: number | null
          stats?: Json | null
          theme_color?: string | null
          updated_at?: string
          user_id?: string
          why_choose_us?: string[] | null
          why_choose_us_descriptions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      topic_subscriptions: {
        Row: {
          id: string
          notification_type: string
          subscribed_at: string
          topic_id: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_type?: string
          subscribed_at?: string
          topic_id: string
          user_id: string
        }
        Update: {
          id?: string
          notification_type?: string
          subscribed_at?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_subscriptions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_tags: {
        Row: {
          created_at: string
          id: string
          tag_id: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag_id: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tag_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_tags_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          author_id: string
          category_id: string
          content: string
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          reply_count: number | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id: string
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trusted_ip_ranges: {
        Row: {
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          ip_range: unknown
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          ip_range: unknown
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          ip_range?: unknown
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: string[] | null
          backup_codes_used: Json | null
          created_at: string
          encrypted_secret: string | null
          id: string
          is_enabled: boolean
          last_used_at: string | null
          secret: string
          secret_iv: string | null
          setup_completed_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          backup_codes_used?: Json | null
          created_at?: string
          encrypted_secret?: string | null
          id?: string
          is_enabled?: boolean
          last_used_at?: string | null
          secret: string
          secret_iv?: string | null
          setup_completed_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          backup_codes_used?: Json | null
          created_at?: string
          encrypted_secret?: string | null
          id?: string
          is_enabled?: boolean
          last_used_at?: string | null
          secret?: string
          secret_iv?: string | null
          setup_completed_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          progress: Json | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          progress?: Json | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          progress?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_device_fingerprints: {
        Row: {
          browser_info: Json | null
          created_at: string
          device_info: Json | null
          fingerprint_hash: string
          first_seen_at: string
          id: string
          is_trusted: boolean | null
          last_seen_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string
          device_info?: Json | null
          fingerprint_hash: string
          first_seen_at?: string
          id?: string
          is_trusted?: boolean | null
          last_seen_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          browser_info?: Json | null
          created_at?: string
          device_info?: Json | null
          fingerprint_hash?: string
          first_seen_at?: string
          id?: string
          is_trusted?: boolean | null
          last_seen_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_levels: {
        Row: {
          created_at: string
          current_level: number
          id: string
          level_title: string | null
          total_xp: number
          updated_at: string
          user_id: string
          xp_this_level: number
        }
        Insert: {
          created_at?: string
          current_level?: number
          id?: string
          level_title?: string | null
          total_xp?: number
          updated_at?: string
          user_id: string
          xp_this_level?: number
        }
        Update: {
          created_at?: string
          current_level?: number
          id?: string
          level_title?: string | null
          total_xp?: number
          updated_at?: string
          user_id?: string
          xp_this_level?: number
        }
        Relationships: []
      }
      user_online_status: {
        Row: {
          created_at: string
          id: string
          is_online: boolean
          last_seen: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_online?: boolean
          last_seen?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_online?: boolean
          last_seen?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          category_id: string
          created_at: string
          id: string
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "point_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_privacy_settings: {
        Row: {
          activity_tracking: boolean
          created_at: string
          data_sharing: boolean
          email_notifications: boolean
          id: string
          marketing_emails: boolean
          profile_visibility: string
          security_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_tracking?: boolean
          created_at?: string
          data_sharing?: boolean
          email_notifications?: boolean
          id?: string
          marketing_emails?: boolean
          profile_visibility?: string
          security_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_tracking?: boolean
          created_at?: string
          data_sharing?: boolean
          email_notifications?: boolean
          id?: string
          marketing_emails?: boolean
          profile_visibility?: string
          security_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_pwa_settings: {
        Row: {
          created_at: string
          id: string
          last_sync_at: string | null
          offline_reading_enabled: boolean
          push_notifications_enabled: boolean
          push_subscription: Json | null
          sync_frequency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_sync_at?: string | null
          offline_reading_enabled?: boolean
          push_notifications_enabled?: boolean
          push_subscription?: Json | null
          sync_frequency?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_sync_at?: string | null
          offline_reading_enabled?: boolean
          push_notifications_enabled?: boolean
          push_subscription?: Json | null
          sync_frequency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          claimed_at: string
          id: string
          is_active: boolean | null
          reward_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          is_active?: boolean | null
          reward_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          is_active?: boolean | null
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_security_events: {
        Row: {
          created_at: string
          event_description: string
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          risk_level: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          risk_level?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          risk_level?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_security_scores: {
        Row: {
          created_at: string
          factors: Json | null
          id: string
          recommendations: Json | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          factors?: Json | null
          id?: string
          recommendations?: Json | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          factors?: Json | null
          id?: string
          recommendations?: Json | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          expires_at: string
          id: string
          ip_address: unknown | null
          last_activity_at: string
          location: string | null
          session_token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity_at?: string
          location?: string | null
          session_token: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          last_activity_at?: string
          location?: string | null
          session_token?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          streak_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          streak_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          streak_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_achievement: {
        Args: {
          achievement_name: string
          progress_data?: Json
          target_user_id: string
        }
        Returns: boolean
      }
      award_category_points: {
        Args: {
          category_name: string
          points_amount: number
          target_user_id: string
        }
        Returns: boolean
      }
      award_xp: {
        Args: { reason?: string; target_user_id: string; xp_amount: number }
        Returns: boolean
      }
      calculate_user_level: {
        Args: { total_xp: number }
        Returns: {
          level_number: number
          title: string
          xp_for_current: number
          xp_for_next: number
        }[]
      }
      calculate_user_security_score: {
        Args: { target_user_id: string }
        Returns: number
      }
      create_activity_entry: {
        Args: { activity_data?: Json; activity_type: string; user_id: string }
        Returns: string
      }
      create_notification: {
        Args: {
          notification_data?: Json
          notification_message?: string
          notification_title: string
          notification_type: string
          recipient_id: string
        }
        Returns: string
      }
      create_security_event: {
        Args: {
          event_description: string
          event_type: string
          metadata?: Json
          risk_level?: string
          target_user_id: string
        }
        Returns: string
      }
      get_client_ip: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_profile_visibility: {
        Args: { target_user_id: string }
        Returns: string
      }
      handle_login_attempt: {
        Args: {
          attempt_email: string
          attempt_ip: unknown
          is_successful?: boolean
        }
        Returns: Json
      }
      update_user_reputation: {
        Args: {
          change_amount: number
          reason: string
          related_item_id?: string
          related_item_type?: string
          target_user_id: string
        }
        Returns: undefined
      }
      update_user_security_score: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      update_user_streak: {
        Args: { p_streak_type?: string; target_user_id: string }
        Returns: number
      }
      verify_user_password: {
        Args: { password_to_verify: string; user_email: string }
        Returns: boolean
      }
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
  public: {
    Enums: {},
  },
} as const
