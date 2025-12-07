/*
  # Drop old insert_assessment function version
  
  1. Changes
    - Drop the old version of insert_assessment that's missing parameters
    - This will leave only the complete version with all parameters
    
  2. Impact
    - Resolves function overloading that was confusing PostgREST
*/

DROP FUNCTION IF EXISTS insert_assessment(
  timestamptz,
  text,
  text,
  text,
  text,
  text,
  integer,
  numeric,
  numeric,
  numeric,
  numeric,
  numeric,
  numeric,
  numeric,
  numeric,
  numeric,
  uuid
);