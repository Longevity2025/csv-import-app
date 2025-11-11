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
          grip_r_pct: number | null
          grip_l_pct: number | null
          sway_r_pct: number | null
          sway_l_pct: number | null
          mobility_age: number | null
          user_id: string
          created_at: string | null
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
          grip_r_pct?: number | null
          grip_l_pct?: number | null
          sway_r_pct?: number | null
          sway_l_pct?: number | null
          mobility_age?: number | null
          user_id: string
          created_at?: string | null
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
          grip_r_pct?: number | null
          grip_l_pct?: number | null
          sway_r_pct?: number | null
          sway_l_pct?: number | null
          mobility_age?: number | null
          user_id?: string
          created_at?: string | null
        }
      }
    }
  }
}
