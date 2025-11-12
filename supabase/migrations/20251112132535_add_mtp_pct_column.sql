/*
  # Add mtp_pct column

  1. Changes
    - Add mtp_pct column to assessments table for storing MTP percentage data
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessments' AND column_name = 'mtp_pct') THEN
    ALTER TABLE assessments ADD COLUMN mtp_pct numeric;
  END IF;
END $$;