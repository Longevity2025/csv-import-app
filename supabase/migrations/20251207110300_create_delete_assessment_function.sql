/*
  # Create delete_assessment function
  
  1. Purpose
    - Bypass PostgREST schema cache by using database function
    - Delete an assessment by ID
    
  2. Security
    - Function runs with caller's privileges (SECURITY INVOKER)
    - RLS policies will still be enforced
*/

CREATE OR REPLACE FUNCTION delete_assessment(p_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  DELETE FROM assessments WHERE id = p_id;
END;
$$;
