/*
  # Fix insert_assessment function with alphabetical parameter order
  
  1. Changes
    - Drop existing insert_assessment function
    - Recreate with ALL parameters in strict alphabetical order for PostgREST RPC compatibility
    
  2. Notes
    - PostgREST requires parameters in alphabetical order when calling via RPC with named parameters
*/

DROP FUNCTION IF EXISTS insert_assessment;

CREATE OR REPLACE FUNCTION insert_assessment(
  p_age integer DEFAULT NULL,
  p_app_version text DEFAULT NULL,
  p_grip_l_pct numeric DEFAULT NULL,
  p_grip_r_pct numeric DEFAULT NULL,
  p_location text DEFAULT NULL,
  p_mip_pct numeric DEFAULT NULL,
  p_mobility_age numeric DEFAULT NULL,
  p_mtp_pct numeric DEFAULT NULL,
  p_name_full text DEFAULT NULL,
  p_sex text DEFAULT NULL,
  p_sitreach_in numeric DEFAULT NULL,
  p_sway_l_pct numeric DEFAULT NULL,
  p_sway_r_pct numeric DEFAULT NULL,
  p_tester text DEFAULT NULL,
  p_timestamp_local timestamptz DEFAULT NULL,
  p_tug_s numeric DEFAULT NULL,
  p_user_id uuid DEFAULT NULL,
  p_user_id_csv text DEFAULT NULL,
  p_vo2_mlkgmin numeric DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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