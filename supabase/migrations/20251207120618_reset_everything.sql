/*
  # Reset Everything

  1. Drop all functions
  2. Drop assessments table
  3. Clean slate for fresh start
*/

DROP FUNCTION IF EXISTS insert_assessment CASCADE;
DROP FUNCTION IF EXISTS get_assessments CASCADE;
DROP FUNCTION IF EXISTS delete_assessment CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
