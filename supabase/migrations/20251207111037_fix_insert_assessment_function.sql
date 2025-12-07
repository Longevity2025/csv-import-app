/*
  # Fix insert_assessment function - Add missing parameters
  
  1. Changes
    - Add p_mip_pct parameter (was missing)
    - Add p_user_id_csv parameter (was missing)
    - These columns exist in the table but were not in the function signature
    
  2. Impact
    - Fixes CSV import errors for assessments
*/

CREATE OR REPLACE FUNCTION insert_assessment(
  p_timestamp_local timestamptz,
  p_app_version text,
  p_name_full text,
  p_tester text,
  p_location text,
  p_sex text,
  p_age integer,
  p_tug_s numeric DEFAULT NULL,
  p_vo2_mlkgmin numeric DEFAULT NULL,
  p_sitreach_in numeric DEFAULT NULL,
  p_mtp_pct numeric DEFAULT NULL,
  p_mip_pct numeric DEFAULT NULL,
  p_grip_r_pct numeric DEFAULT NULL,
  p_grip_l_pct numeric DEFAULT NULL,
  p_sway_r_pct numeric DEFAULT NULL,
  p_sway_l_pct numeric DEFAULT NULL,
  p_mobility_age numeric DEFAULT NULL,
  p_user_id_csv text DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  INSERT INTO assessments (
    timestamp_local,
    app_version,
    name_full,
    tester,
    location,
    sex,
    age,
    tug_s,
    vo2_mlkgmin,
    sitreach_in,
    mtp_pct,
    mip_pct,
    grip_r_pct,
    grip_l_pct,
    sway_r_pct,
    sway_l_pct,
    mobility_age,
    user_id_csv,
    user_id
  ) VALUES (
    p_timestamp_local,
    p_app_version,
    p_name_full,
    p_tester,
    p_location,
    p_sex,
    p_age,
    p_tug_s,
    p_vo2_mlkgmin,
    p_sitreach_in,
    p_mtp_pct,
    p_mip_pct,
    p_grip_r_pct,
    p_grip_l_pct,
    p_sway_r_pct,
    p_sway_l_pct,
    p_mobility_age,
    p_user_id_csv,
    p_user_id
  );
END;
$$;