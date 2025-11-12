/*
  # Add Missing Assessment Columns

  1. Changes
    - Add all missing columns from the CSV data structure to the assessments table
    - Columns include: sex, location, mobility_age, name_full, tester, timestamp_local,
      tug_s, user_id (string), vo2_mlkgmin, grip_l_pct, grip_r_pct, mip_pct, sway_l_pct,
      sway_r_pct, sitreach_in, app_version
    
  2. Notes
    - Using appropriate data types for each field
    - All columns are nullable to accommodate varying CSV data
    - user_id from CSV will be stored as user_id_csv to avoid conflict with FK user_id
*/

-- Add missing columns to assessments table
DO $$
BEGIN
  -- Basic demographic and test info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'sex') THEN
    ALTER TABLE assessments ADD COLUMN sex text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'location') THEN
    ALTER TABLE assessments ADD COLUMN location text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'mobility_age') THEN
    ALTER TABLE assessments ADD COLUMN mobility_age numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'name_full') THEN
    ALTER TABLE assessments ADD COLUMN name_full text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'tester') THEN
    ALTER TABLE assessments ADD COLUMN tester text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'timestamp_local') THEN
    ALTER TABLE assessments ADD COLUMN timestamp_local text;
  END IF;
  
  -- Performance metrics
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'tug_s') THEN
    ALTER TABLE assessments ADD COLUMN tug_s numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'vo2_mlkgmin') THEN
    ALTER TABLE assessments ADD COLUMN vo2_mlkgmin numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'grip_l_pct') THEN
    ALTER TABLE assessments ADD COLUMN grip_l_pct numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'grip_r_pct') THEN
    ALTER TABLE assessments ADD COLUMN grip_r_pct numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'mip_pct') THEN
    ALTER TABLE assessments ADD COLUMN mip_pct numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'sway_l_pct') THEN
    ALTER TABLE assessments ADD COLUMN sway_l_pct numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'sway_r_pct') THEN
    ALTER TABLE assessments ADD COLUMN sway_r_pct numeric;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'sitreach_in') THEN
    ALTER TABLE assessments ADD COLUMN sitreach_in numeric;
  END IF;
  
  -- System fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'user_id_csv') THEN
    ALTER TABLE assessments ADD COLUMN user_id_csv text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'app_version') THEN
    ALTER TABLE assessments ADD COLUMN app_version text;
  END IF;
END $$;