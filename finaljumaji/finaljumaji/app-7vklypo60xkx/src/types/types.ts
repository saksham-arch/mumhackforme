export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  language_preference: string;
  primary_income_type: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: 'self' | 'spouse' | 'child' | 'parent' | 'other';
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  occupation: string | null;
  monthly_income: number;
  is_active: boolean;
  avatar_url: string | null;
  created_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  member_id: string | null;
  name: string;
  type: 'stocks' | 'bonds' | 'real_estate' | 'crypto' | 'mutual_funds' | 'other';
  initial_amount: number;
  current_value: number;
  purchase_date: string;
  expected_return_rate: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  member_id: string | null;
  type: 'income' | 'expense';
  amount: number;
  category: string | null;
  description: string | null;
  date: string;
  created_at: string;
}

export interface Bill {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  due_date: string;
  status: 'upcoming' | 'paid';
  category: string | null;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: string;
}

export interface AdviceHistory {
  id: string;
  user_id: string;
  category: 'savings' | 'emergency' | 'planning';
  question: string;
  answer: string;
  created_at: string;
}

export interface VoiceSmsHistory {
  id: string;
  user_id: string;
  type: 'voice' | 'sms';
  content: string;
  summary: string | null;
  created_at: string;
}

export interface SafetyLog {
  id: string;
  user_id: string;
  log_type: 'high_risk' | 'fallback' | 'asr_failure' | 'inconsistency';
  description: string;
  risk_score: number | null;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type: 'low_balance' | 'bill_due' | 'goal_behind' | 'overspend_warning';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  is_read: boolean;
  created_at: string;
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  month: string;
  total_income: number;
  total_expenses: number;
  biggest_category: string | null;
  biggest_category_amount: number | null;
  good_habits: string[] | null;
  bad_habits: string[] | null;
  suggestions: string[] | null;
  created_at: string;
}

export interface Receipt {
  id: string;
  user_id: string;
  image_url: string | null;
  amount: number;
  merchant: string | null;
  date: string;
  category: string | null;
  tax_amount: number | null;
  extracted_data: any;
  created_at: string;
}

export interface BudgetPlan {
  id: string;
  user_id: string;
  age: number | null;
  income: number;
  responsibilities: string | null;
  fixed_expenses: number | null;
  lifestyle: string | null;
  budget_percentages: any;
  savings_plan: string | null;
  emergency_fund_target: number | null;
  investment_split: any;
  created_at: string;
}

export interface SpendingForecast {
  id: string;
  user_id: string;
  forecast_month: string;
  predicted_expenses: number;
  predicted_income: number | null;
  cash_shortage_date: string | null;
  overspend_risk: string | null;
  safe_to_spend: number | null;
  confidence_score: number | null;
  created_at: string;
}

export interface TimelineItem {
  id: string;
  type: 'income' | 'expense' | 'advice' | 'voice' | 'sms' | 'risk';
  content: string;
  amount?: number;
  timestamp: string;
  category?: string;
}
