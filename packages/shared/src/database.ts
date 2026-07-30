export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: { id: string; name: string; slug: string; plan: string; created_at: string }
        Insert: { id?: string; name: string; slug: string; plan?: string }
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      projects: {
        Row: {
          id: string
          org_id: string
          name: string
          slug: string
          default_branch: string
          base_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          slug: string
          default_branch?: string
          base_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      runs: {
        Row: {
          id: string
          project_id: string
          status: string
          commit_sha: string | null
          branch: string | null
          confidence_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          status?: string
          commit_sha?: string | null
          branch?: string | null
          confidence_score?: number | null
        }
        Update: Partial<Database['public']['Tables']['runs']['Insert']>
      }
      results: {
        Row: {
          id: string
          run_id: string
          test_name: string
          status: string
          browser: string
          viewport: string
          checks: Json
          created_at: string
        }
        Insert: {
          id?: string
          run_id: string
          test_name: string
          status: string
          browser: string
          viewport: string
          checks?: Json
        }
        Update: Partial<Database['public']['Tables']['results']['Insert']>
      }
    }
  }
}
