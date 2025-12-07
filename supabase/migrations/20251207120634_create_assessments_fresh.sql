/*
  # Create Assessments Table - Fresh Start

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users)
      - `name_full` (text)
      - `age` (integer)
      - `sex` (text)
      - `timestamp_local` (timestamptz)
      - `location` (text)
      - `tester` (text)
      - `app_version` (text)
      - `user_id_csv` (text)
      - `tug_s` (numeric)
      - `sitreach_in` (numeric)
      - `grip_l_pct` (numeric)
      - `grip_r_pct` (numeric)
      - `vo2_mlkgmin` (numeric)
      - `sway_l_pct` (numeric)
      - `sway_r_pct` (numeric)
      - `mip_pct` (numeric)
      - `mtp_pct` (numeric)
      - `mobility_age` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Users can only access their own assessments
*/

CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name_full text NOT NULL,
  age integer,
  sex text,
  timestamp_local timestamptz,
  location text DEFAULT '',
  tester text DEFAULT '',
  app_version text DEFAULT '',
  user_id_csv text DEFAULT '',
  tug_s numeric,
  sitreach_in numeric,
  grip_l_pct numeric,
  grip_r_pct numeric,
  vo2_mlkgmin numeric,
  sway_l_pct numeric,
  sway_r_pct numeric,
  mip_pct numeric,
  mtp_pct numeric,
  mobility_age numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_timestamp ON assessments(timestamp_local DESC);
