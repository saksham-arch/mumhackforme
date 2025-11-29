/*
# Add AI-Powered Features

## 1. New Tables

### alerts
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `type` (text: 'low_balance', 'bill_due', 'goal_behind', 'overspend_warning')
- `title` (text)
- `message` (text)
- `severity` (text: 'info', 'warning', 'critical')
- `is_read` (boolean, default: false)
- `created_at` (timestamptz, default: now())

### monthly_reports
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `month` (date)
- `total_income` (numeric)
- `total_expenses` (numeric)
- `biggest_category` (text)
- `biggest_category_amount` (numeric)
- `good_habits` (text[])
- `bad_habits` (text[])
- `suggestions` (text[])
- `created_at` (timestamptz, default: now())

### receipts
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `image_url` (text)
- `amount` (numeric)
- `merchant` (text)
- `date` (date)
- `category` (text)
- `tax_amount` (numeric)
- `extracted_data` (jsonb)
- `created_at` (timestamptz, default: now())

### budget_plans
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `age` (integer)
- `income` (numeric)
- `responsibilities` (text)
- `fixed_expenses` (numeric)
- `lifestyle` (text)
- `budget_percentages` (jsonb)
- `savings_plan` (text)
- `emergency_fund_target` (numeric)
- `investment_split` (jsonb)
- `created_at` (timestamptz, default: now())

### spending_forecasts
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `forecast_month` (date)
- `predicted_expenses` (numeric)
- `predicted_income` (numeric)
- `cash_shortage_date` (date)
- `overspend_risk` (text)
- `safe_to_spend` (numeric)
- `confidence_score` (numeric)
- `created_at` (timestamptz, default: now())

## 2. Security

- Enable RLS on all new tables
- Users can only access their own data
- Admins have full access

## 3. Notes

- AI features will use placeholder logic initially
- Can be enhanced with actual AI/ML models later
*/

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('low_balance', 'bill_due', 'goal_behind', 'overspend_warning')),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create monthly_reports table
CREATE TABLE IF NOT EXISTS monthly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  month date NOT NULL,
  total_income numeric NOT NULL,
  total_expenses numeric NOT NULL,
  biggest_category text,
  biggest_category_amount numeric,
  good_habits text[],
  bad_habits text[],
  suggestions text[],
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text,
  amount numeric NOT NULL,
  merchant text,
  date date NOT NULL,
  category text,
  tax_amount numeric,
  extracted_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create budget_plans table
CREATE TABLE IF NOT EXISTS budget_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  age integer,
  income numeric NOT NULL,
  responsibilities text,
  fixed_expenses numeric,
  lifestyle text,
  budget_percentages jsonb,
  savings_plan text,
  emergency_fund_target numeric,
  investment_split jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create spending_forecasts table
CREATE TABLE IF NOT EXISTS spending_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  forecast_month date NOT NULL,
  predicted_expenses numeric NOT NULL,
  predicted_income numeric,
  cash_shortage_date date,
  overspend_risk text,
  safe_to_spend numeric,
  confidence_score numeric,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, forecast_month)
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE spending_forecasts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alerts
CREATE POLICY "Admins have full access to alerts" ON alerts
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own alerts" ON alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts" ON alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON alerts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for monthly_reports
CREATE POLICY "Admins have full access to monthly_reports" ON monthly_reports
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own monthly_reports" ON monthly_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own monthly_reports" ON monthly_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for receipts
CREATE POLICY "Admins have full access to receipts" ON receipts
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own receipts" ON receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receipts" ON receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receipts" ON receipts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receipts" ON receipts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for budget_plans
CREATE POLICY "Admins have full access to budget_plans" ON budget_plans
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own budget_plans" ON budget_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget_plans" ON budget_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget_plans" ON budget_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budget_plans" ON budget_plans
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for spending_forecasts
CREATE POLICY "Admins have full access to spending_forecasts" ON spending_forecasts
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own spending_forecasts" ON spending_forecasts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spending_forecasts" ON spending_forecasts
  FOR INSERT WITH CHECK (auth.uid() = user_id);