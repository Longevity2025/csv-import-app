/*
  # Optimize RLS Policies and Database Indexes

  1. Performance Optimizations
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth function for each row, improving query performance at scale
    
  2. Index Cleanup
    - Remove unused indexes `idx_assessments_timestamp` and `idx_assessments_name`
    - These indexes are not being utilized by queries
    
  3. Changes Made
    - Drop and recreate SELECT policy with optimized auth check
    - Drop and recreate INSERT policy with optimized auth check
    - Drop and recreate UPDATE policy with optimized auth check
    - Drop and recreate DELETE policy with optimized auth check
    - Drop unused timestamp index
    - Drop unused name index
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can insert own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can update own assessments" ON assessments;
DROP POLICY IF EXISTS "Users can delete own assessments" ON assessments;

-- Create optimized policies using (select auth.uid())
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop unused indexes
DROP INDEX IF EXISTS idx_assessments_timestamp;
DROP INDEX IF EXISTS idx_assessments_name;
