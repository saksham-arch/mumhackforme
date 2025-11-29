/*
# Add Family Members and Investments

## 1. New Tables

### family_members
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles) - account owner
- `name` (text)
- `relationship` (text: 'self', 'spouse', 'child', 'parent', 'other')
- `email` (text)
- `phone` (text)
- `date_of_birth` (date)
- `occupation` (text)
- `monthly_income` (numeric)
- `is_active` (boolean, default: true)
- `avatar_url` (text)
- `created_at` (timestamptz, default: now())

### investments
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `member_id` (uuid, references family_members)
- `name` (text)
- `type` (text: 'stocks', 'bonds', 'real_estate', 'crypto', 'mutual_funds', 'other')
- `initial_amount` (numeric)
- `current_value` (numeric)
- `purchase_date` (date)
- `expected_return_rate` (numeric) - annual percentage
- `notes` (text)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

## 2. Table Modifications

- Add `member_id` to transactions table to link transactions to specific family members

## 3. Security

- Enable RLS on new tables
- Users can only access their own family members and investments
- Admins have full access

## 4. Notes

- Family members allow tracking income/expenses per person
- Investments track portfolio and predict returns
- All financial predictions now include all members and investments
*/

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  relationship text NOT NULL CHECK (relationship IN ('self', 'spouse', 'child', 'parent', 'other')),
  email text,
  phone text,
  date_of_birth date,
  occupation text,
  monthly_income numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES family_members(id) ON DELETE SET NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('stocks', 'bonds', 'real_estate', 'crypto', 'mutual_funds', 'other')),
  initial_amount numeric NOT NULL,
  current_value numeric NOT NULL,
  purchase_date date NOT NULL,
  expected_return_rate numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add member_id to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS member_id uuid REFERENCES family_members(id) ON DELETE SET NULL;

-- Create trigger for investments updated_at
CREATE OR REPLACE FUNCTION update_investments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER investments_updated_at
  BEFORE UPDATE ON investments
  FOR EACH ROW
  EXECUTE FUNCTION update_investments_updated_at();

-- Enable RLS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family_members
CREATE POLICY "Admins have full access to family_members" ON family_members
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own family_members" ON family_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family_members" ON family_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family_members" ON family_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own family_members" ON family_members
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for investments
CREATE POLICY "Admins have full access to investments" ON investments
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own investments" ON investments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investments" ON investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investments" ON investments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own investments" ON investments
  FOR DELETE USING (auth.uid() = user_id);