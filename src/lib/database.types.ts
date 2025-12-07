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
      assessments: {
        Row: {
          id: string
          timestamp_local: string
          app_version: string
          name_full: string
          tester: string
          location: string
          sex: string
          age: number
          tug_s: number | null
          vo2_mlkgmin: number | null
          sitreach_in: number | null
          mtp_pct: number | null
          mip_pct: number | null
          grip_r_pct: number | null
          grip_l_pct: number | null
          sway_r_pct: number | null
          sway_l_pct: number | null
          mobility_age: number | null
          user_id: string
          created_at: string
          user_id_csv: string | null
        }
        Insert: {
          id?: string
          timestamp_local: string
          app_version?: string
          name_full: string
          tester?: string
          location?: string
          sex: string
          age: number
          tug_s?: number | null
          vo2_mlkgmin?: number | null
          sitreach_in?: number | null
          mtp_pct?: number | null
          mip_pct?: number | null
          grip_r_pct?: number | null
          grip_l_pct?: number | null
          sway_r_pct?: number | null
          sway_l_pct?: number | null
          mobility_age?: number | null
          user_id: string
          created_at?: string
          user_id_csv?: string | null
        }
        Update: {
          id?: string
          timestamp_local?: string
          app_version?: string
          name_full?: string
          tester?: string
          location?: string
          sex?: string
          age?: number
          tug_s?: number | null
          vo2_mlkgmin?: number | null
          sitreach_in?: number | null
          mtp_pct?: number | null
          mip_pct?: number | null
          grip_r_pct?: number | null
          grip_l_pct?: number | null
          sway_r_pct?: number | null
          sway_l_pct?: number | null
          mobility_age?: number | null
          user_id?: string
          created_at?: string
          user_id_csv?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_assessment: {
        Args: {
          p_timestamp_local: string
          p_app_version: string
          p_name_full: string
          p_tester: string
          p_location: string
          p_sex: string
          p_age: number
          p_tug_s: number | null
          p_vo2_mlkgmin: number | null
          p_sitreach_in: number | null
          p_mtp_pct: number | null
          p_mip_pct: number | null
          p_grip_r_pct: number | null
          p_grip_l_pct: number | null
          p_sway_r_pct: number | null
          p_sway_l_pct: number | null
          p_mobility_age: number | null
          p_user_id_csv: string
          p_user_id: string
        }
        Returns: void
      }
      get_assessments: {
        Args: {
          p_user_id: string
        }
        Returns: Database['public']['Tables']['assessments']['Row'][]
      }
      delete_assessment: {
        Args: {
          p_assessment_id: string
          p_user_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
