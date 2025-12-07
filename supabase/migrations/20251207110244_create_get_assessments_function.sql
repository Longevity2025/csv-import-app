/*
  # Create get_assessments function
  
  1. Purpose
    - Bypass PostgREST schema cache by using database function
    - Return all assessments for the current user
    
  2. Security
    - Function runs with caller's privileges (SECURITY INVOKER)
    - RLS policies will still be enforced
*/

CREATE OR REPLACE FUNCTION get_assessments()
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  timestamp_local timestamptz,
  app_version text,
  name_full text,
  tester text,
  location text,
  sex text,
  age integer,
  tug_s numeric,
  vo2_mlkgmin numeric,
  sitreach_in numeric,
  mtp_pct numeric,
  mip_pct numeric,
  grip_r_pct numeric,
  grip_l_pct numeric,
  sway_r_pct numeric,
  sway_l_pct numeric,
  mobility_age numeric,
  user_id_csv text,
  user_id uuid
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.created_at,
    a.timestamp_local,
    a.app_version,
    a.name_full,
    a.tester,
    a.location,
    a.sex,
    a.age,
    a.tug_s,
    a.vo2_mlkgmin,
    a.sitreach_in,
    a.mtp_pct,
    a.mip_pct,
    a.grip_r_pct,
    a.grip_l_pct,
    a.sway_r_pct,
    a.sway_l_pct,
    a.mobility_age,
    a.user_id_csv,
    a.user_id
  FROM assessments a
  ORDER BY a.timestamp_local DESC;
END;
$$;
