/*
  # Initial Database Setup for CSV Import App

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `age` (integer)
      - `score` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `assessments` table
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Index on user_id for faster queries
    - Index on created_at for sorting
*/

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer,
  score numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
