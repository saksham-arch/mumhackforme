/*
# FlowGuide Personal - Initial Database Schema

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `phone` (text, unique)
- `name` (text)
- `language_preference` (text, default: 'en')
- `primary_income_type` (text)
- `role` (user_role, default: 'user')
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### transactions
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `type` (text: 'income' or 'expense')
- `amount` (numeric)
- `category` (text)
- `description` (text)
- `date` (date)
- `created_at` (timestamptz, default: now())

### bills
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `name` (text)
- `amount` (numeric)
- `due_date` (date)
- `status` (text: 'upcoming' or 'paid')
- `category` (text)
- `created_at` (timestamptz, default: now())

### goals
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `name` (text)
- `target_amount` (numeric)
- `current_amount` (numeric, default: 0)
- `deadline` (date)
- `created_at` (timestamptz, default: now())

### advice_history
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `category` (text: 'savings', 'emergency', 'planning')
- `question` (text)
- `answer` (text)
- `created_at` (timestamptz, default: now())

### voice_sms_history
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `type` (text: 'voice' or 'sms')
- `content` (text)
- `summary` (text)
- `created_at` (timestamptz, default: now())

### safety_logs
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `log_type` (text: 'high_risk', 'fallback', 'asr_failure', 'inconsistency')
- `description` (text)
- `risk_score` (integer)
- `created_at` (timestamptz, default: now())

## 2. Security

- Enable RLS on all tables
- Create admin helper function
- Admins have full access to all data
- Users can only access their own data
- Public profiles view for shareable information

## 3. Triggers

- Auto-sync users to profiles after email/phone confirmation
- First user becomes admin
- Update updated_at timestamp on profile changes
*/

-- Create user_role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  phone text UNIQUE,
  name text,
  language_preference text DEFAULT 'en',
  primary_income_type text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric NOT NULL,
  category text,
  description text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bills table
CREATE TABLE IF NOT EXISTS bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('upcoming', 'paid')),
  category text,
  created_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric DEFAULT 0,
  deadline date,
  created_at timestamptz DEFAULT now()
);

-- Create advice_history table
CREATE TABLE IF NOT EXISTS advice_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('savings', 'emergency', 'planning')),
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create voice_sms_history table
CREATE TABLE IF NOT EXISTS voice_sms_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('voice', 'sms')),
  content text NOT NULL,
  summary text,
  created_at timestamptz DEFAULT now()
);

-- Create safety_logs table
CREATE TABLE IF NOT EXISTS safety_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  log_type text NOT NULL CHECK (log_type IN ('high_risk', 'fallback', 'asr_failure', 'inconsistency')),
  description text NOT NULL,
  risk_score integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE advice_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_sms_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_logs ENABLE ROW LEVEL SECURITY;

-- Create admin helper function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Create trigger function to handle new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  INSERT INTO profiles (id, email, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user confirmation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id) 
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- RLS Policies for transactions
CREATE POLICY "Admins have full access to transactions" ON transactions
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for bills
CREATE POLICY "Admins have full access to bills" ON bills
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own bills" ON bills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bills" ON bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bills" ON bills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bills" ON bills
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Admins have full access to goals" ON goals
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for advice_history
CREATE POLICY "Admins have full access to advice_history" ON advice_history
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own advice_history" ON advice_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own advice_history" ON advice_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for voice_sms_history
CREATE POLICY "Admins have full access to voice_sms_history" ON voice_sms_history
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own voice_sms_history" ON voice_sms_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice_sms_history" ON voice_sms_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for safety_logs
CREATE POLICY "Admins have full access to safety_logs" ON safety_logs
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own safety_logs" ON safety_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own safety_logs" ON safety_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create public_profiles view
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  name,
  created_at
FROM profiles;