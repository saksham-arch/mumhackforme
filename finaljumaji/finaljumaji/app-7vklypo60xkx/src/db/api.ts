import { supabase } from './supabase';
import type {
  Profile,
  Transaction,
  Bill,
  Goal,
  AdviceHistory,
  VoiceSmsHistory,
  SafetyLog,
  Alert,
  MonthlyReport,
  Receipt,
  BudgetPlan,
  SpendingForecast,
  FamilyMember,
  Investment,
} from '@/types/types';

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Transaction APIs
export const getTransactions = async (
  userId: string,
  limit = 50
): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createTransaction = async (
  transaction: Omit<Transaction, 'id' | 'created_at'>
): Promise<Transaction | null> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction | null> => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);

  if (error) throw error;
};

export const getBalance = async (userId: string): Promise<number> => {
  const transactions = await getTransactions(userId, 1000);
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + Number(t.amount) : acc - Number(t.amount);
  }, 0);
};

// Bill APIs
export const getBills = async (userId: string): Promise<Bill[]> => {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createBill = async (
  bill: Omit<Bill, 'id' | 'created_at'>
): Promise<Bill | null> => {
  const { data, error } = await supabase
    .from('bills')
    .insert(bill)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateBill = async (
  id: string,
  updates: Partial<Bill>
): Promise<Bill | null> => {
  const { data, error } = await supabase
    .from('bills')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteBill = async (id: string): Promise<void> => {
  const { error } = await supabase.from('bills').delete().eq('id', id);

  if (error) throw error;
};

// Goal APIs
export const getGoals = async (userId: string): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createGoal = async (
  goal: Omit<Goal, 'id' | 'created_at'>
): Promise<Goal | null> => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateGoal = async (
  id: string,
  updates: Partial<Goal>
): Promise<Goal | null> => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteGoal = async (id: string): Promise<void> => {
  const { error } = await supabase.from('goals').delete().eq('id', id);

  if (error) throw error;
};

// Advice History APIs
export const getAdviceHistory = async (userId: string): Promise<AdviceHistory[]> => {
  const { data, error } = await supabase
    .from('advice_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createAdviceHistory = async (
  advice: Omit<AdviceHistory, 'id' | 'created_at'>
): Promise<AdviceHistory | null> => {
  const { data, error } = await supabase
    .from('advice_history')
    .insert(advice)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Voice & SMS History APIs
export const getVoiceSmsHistory = async (
  userId: string
): Promise<VoiceSmsHistory[]> => {
  const { data, error } = await supabase
    .from('voice_sms_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createVoiceSmsHistory = async (
  history: Omit<VoiceSmsHistory, 'id' | 'created_at'>
): Promise<VoiceSmsHistory | null> => {
  const { data, error } = await supabase
    .from('voice_sms_history')
    .insert(history)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Safety Log APIs
export const getSafetyLogs = async (userId: string): Promise<SafetyLog[]> => {
  const { data, error } = await supabase
    .from('safety_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createSafetyLog = async (
  log: Omit<SafetyLog, 'id' | 'created_at'>
): Promise<SafetyLog | null> => {
  const { data, error } = await supabase
    .from('safety_logs')
    .insert(log)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Alert APIs
export const getAlerts = async (userId: string): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getUnreadAlerts = async (userId: string): Promise<Alert[]> => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createAlert = async (
  alert: Omit<Alert, 'id' | 'created_at'>
): Promise<Alert | null> => {
  const { data, error } = await supabase
    .from('alerts')
    .insert(alert)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const markAlertAsRead = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('alerts')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
};

export const deleteAlert = async (id: string): Promise<void> => {
  const { error } = await supabase.from('alerts').delete().eq('id', id);

  if (error) throw error;
};

// Monthly Report APIs
export const getMonthlyReports = async (userId: string): Promise<MonthlyReport[]> => {
  const { data, error } = await supabase
    .from('monthly_reports')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getMonthlyReport = async (
  userId: string,
  month: string
): Promise<MonthlyReport | null> => {
  const { data, error } = await supabase
    .from('monthly_reports')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createMonthlyReport = async (
  report: Omit<MonthlyReport, 'id' | 'created_at'>
): Promise<MonthlyReport | null> => {
  const { data, error } = await supabase
    .from('monthly_reports')
    .insert(report)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Receipt APIs
export const getReceipts = async (userId: string): Promise<Receipt[]> => {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createReceipt = async (
  receipt: Omit<Receipt, 'id' | 'created_at'>
): Promise<Receipt | null> => {
  const { data, error } = await supabase
    .from('receipts')
    .insert(receipt)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteReceipt = async (id: string): Promise<void> => {
  const { error } = await supabase.from('receipts').delete().eq('id', id);

  if (error) throw error;
};

// Budget Plan APIs
export const getBudgetPlans = async (userId: string): Promise<BudgetPlan[]> => {
  const { data, error } = await supabase
    .from('budget_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createBudgetPlan = async (
  plan: Omit<BudgetPlan, 'id' | 'created_at'>
): Promise<BudgetPlan | null> => {
  const { data, error } = await supabase
    .from('budget_plans')
    .insert(plan)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Spending Forecast APIs
export const getSpendingForecasts = async (
  userId: string
): Promise<SpendingForecast[]> => {
  const { data, error } = await supabase
    .from('spending_forecasts')
    .select('*')
    .eq('user_id', userId)
    .order('forecast_month', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createSpendingForecast = async (
  forecast: Omit<SpendingForecast, 'id' | 'created_at'>
): Promise<SpendingForecast | null> => {
  const { data, error } = await supabase
    .from('spending_forecasts')
    .insert(forecast)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Family Member APIs
export const getFamilyMembers = async (userId: string): Promise<FamilyMember[]> => {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createFamilyMember = async (
  member: Omit<FamilyMember, 'id' | 'created_at'>
): Promise<FamilyMember | null> => {
  const { data, error } = await supabase
    .from('family_members')
    .insert(member)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateFamilyMember = async (
  id: string,
  updates: Partial<FamilyMember>
): Promise<FamilyMember | null> => {
  const { data, error } = await supabase
    .from('family_members')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteFamilyMember = async (id: string): Promise<void> => {
  const { error } = await supabase.from('family_members').delete().eq('id', id);

  if (error) throw error;
};

// Investment APIs
export const getInvestments = async (userId: string): Promise<Investment[]> => {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createInvestment = async (
  investment: Omit<Investment, 'id' | 'created_at' | 'updated_at'>
): Promise<Investment | null> => {
  const { data, error } = await supabase
    .from('investments')
    .insert(investment)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateInvestment = async (
  id: string,
  updates: Partial<Investment>
): Promise<Investment | null> => {
  const { data, error } = await supabase
    .from('investments')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteInvestment = async (id: string): Promise<void> => {
  const { error } = await supabase.from('investments').delete().eq('id', id);

  if (error) throw error;
};

// Combined financial data for predictions
export const getTotalFamilyIncome = async (userId: string): Promise<number> => {
  const members = await getFamilyMembers(userId);
  return members
    .filter((m) => m.is_active)
    .reduce((sum, m) => sum + Number(m.monthly_income), 0);
};

export const getTotalInvestmentValue = async (userId: string): Promise<number> => {
  const investments = await getInvestments(userId);
  return investments.reduce((sum, inv) => sum + Number(inv.current_value), 0);
};
