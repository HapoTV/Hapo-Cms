export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'editor' | 'viewer'
          last_active: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'editor' | 'viewer'
          last_active?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'editor' | 'viewer'
          last_active?: string | null
          created_at?: string
        }
      }
      content: {
        Row: {
          id: string
          name: string
          type: 'image' | 'video' | 'template' | 'document'
          url: string
          tags: string[]
          metadata: Json
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'image' | 'video' | 'template' | 'document'
          url: string
          tags?: string[]
          metadata?: Json
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'image' | 'video' | 'template' | 'document'
          url?: string
          tags?: string[]
          metadata?: Json
          user_id?: string
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          locations: string[]
          status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
          content_ids: string[]
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          locations: string[]
          status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
          content_ids: string[]
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          locations?: string[]
          status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused'
          content_ids?: string[]
          user_id?: string
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_type: 'view' | 'engagement'
          campaign_id: string | null
          content_id: string | null
          location: string | null
          duration: number | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          id?: string
          event_type: 'view' | 'engagement'
          campaign_id?: string | null
          content_id?: string | null
          location?: string | null
          duration?: number | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          event_type?: 'view' | 'engagement'
          campaign_id?: string | null
          content_id?: string | null
          location?: string | null
          duration?: number | null
          timestamp?: string
          user_id?: string | null
        }
      }
      system_settings: {
        Row: {
          id: number
          retention_period: number
          default_tags: string[]
          analytics_enabled: boolean
          updated_at: string
        }
        Insert: {
          id?: number
          retention_period: number
          default_tags: string[]
          analytics_enabled: boolean
          updated_at?: string
        }
        Update: {
          id?: number
          retention_period?: number
          default_tags?: string[]
          analytics_enabled?: boolean
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}