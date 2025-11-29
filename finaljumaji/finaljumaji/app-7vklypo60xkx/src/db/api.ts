import {
  getTable,
  insertRecord,
  updateRecord,
  deleteRecord,
  withDemoNetwork,
  generateDemoId,
  nowIsoString,
} from './demoStore';
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

const filterByUser = <T extends { user_id: string }>(records: T[], userId: string) =>
  records.filter((record) => record.user_id === userId);

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> =>
  withDemoNetwork(() => getTable('profiles').find((profile) => profile.id === userId) ?? null);

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> =>
  withDemoNetwork(() =>
    updateRecord('profiles', userId, {
      ...updates,
      updated_at: nowIsoString(),
    })
  );

// Transaction APIs
export const getTransactions = async (
  userId: string,
  limit = 50
): Promise<Transaction[]> =>
  withDemoNetwork(() => {
    const transactions = filterByUser(getTable('transactions'), userId).sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return transactions.slice(0, limit);
  });

export const createTransaction = async (
  transaction: Omit<Transaction, 'id' | 'created_at'>
): Promise<Transaction | null> =>
  withDemoNetwork(() =>
    insertRecord('transactions', {
      ...transaction,
      id: generateDemoId('txn'),
      created_at: nowIsoString(),
    })
  );

export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>
): Promise<Transaction | null> => withDemoNetwork(() => updateRecord('transactions', id, updates));

export const deleteTransaction = async (id: string): Promise<void> => {
  await withDemoNetwork(() => {
    deleteRecord('transactions', id);
  });
};

export const getBalance = async (userId: string): Promise<number> =>
  withDemoNetwork(() =>
    filterByUser(getTable('transactions'), userId).reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + Number(transaction.amount)
        : acc - Number(transaction.amount);
    }, 0)
  );

// Bill APIs
export const getBills = async (userId: string): Promise<Bill[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('bills'), userId).sort((a, b) => {
      const dueDiff = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (dueDiff !== 0) return dueDiff;
      return a.id.localeCompare(b.id);
    })
  );

export const createBill = async (
  bill: Omit<Bill, 'id' | 'created_at'>
): Promise<Bill | null> =>
  withDemoNetwork(() =>
    insertRecord('bills', {
      ...bill,
      id: generateDemoId('bill'),
      created_at: nowIsoString(),
    })
  );

export const updateBill = async (
  id: string,
  updates: Partial<Bill>
): Promise<Bill | null> => withDemoNetwork(() => updateRecord('bills', id, updates));

export const deleteBill = async (id: string): Promise<void> => {
  await withDemoNetwork(() => {
    deleteRecord('bills', id);
  });
};

// Goal APIs
export const getGoals = async (userId: string): Promise<Goal[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('goals'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const createGoal = async (
  goal: Omit<Goal, 'id' | 'created_at'>
): Promise<Goal | null> =>
  withDemoNetwork(() =>
    insertRecord('goals', {
      ...goal,
      id: generateDemoId('goal'),
      created_at: nowIsoString(),
    })
  );

export const updateGoal = async (
  id: string,
  updates: Partial<Goal>
): Promise<Goal | null> => withDemoNetwork(() => updateRecord('goals', id, updates));

export const deleteGoal = async (id: string): Promise<void> => {
  await withDemoNetwork(() => deleteRecord('goals', id));
};

// Advice History APIs
export const getAdviceHistory = async (userId: string): Promise<AdviceHistory[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('advice_history'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const createAdviceHistory = async (
  advice: Omit<AdviceHistory, 'id' | 'created_at'>
): Promise<AdviceHistory | null> =>
  withDemoNetwork(() =>
    insertRecord('advice_history', {
      ...advice,
      id: generateDemoId('advice'),
      created_at: nowIsoString(),
    })
  );

// Voice & SMS History APIs
export const getVoiceSmsHistory = async (
  userId: string
): Promise<VoiceSmsHistory[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('voice_sms_history'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const createVoiceSmsHistory = async (
  history: Omit<VoiceSmsHistory, 'id' | 'created_at'>
): Promise<VoiceSmsHistory | null> =>
  withDemoNetwork(() =>
    insertRecord('voice_sms_history', {
      ...history,
      id: generateDemoId('voice'),
      created_at: nowIsoString(),
    })
  );

// Safety Log APIs
export const getSafetyLogs = async (userId: string): Promise<SafetyLog[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('safety_logs'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const createSafetyLog = async (
  log: Omit<SafetyLog, 'id' | 'created_at'>
): Promise<SafetyLog | null> =>
  withDemoNetwork(() =>
    insertRecord('safety_logs', {
      ...log,
      id: generateDemoId('safety'),
      created_at: nowIsoString(),
    })
  );

// Alert APIs
export const getAlerts = async (userId: string): Promise<Alert[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('alerts'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const getUnreadAlerts = async (userId: string): Promise<Alert[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('alerts'), userId)
      .filter((alert) => !alert.is_read)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  );

export const createAlert = async (
  alert: Omit<Alert, 'id' | 'created_at'>
): Promise<Alert | null> =>
  withDemoNetwork(() =>
    insertRecord('alerts', {
      ...alert,
      id: generateDemoId('alert'),
      is_read: alert.is_read ?? false,
      created_at: nowIsoString(),
    })
  );

export const markAlertAsRead = async (id: string): Promise<void> => {
  await withDemoNetwork(() => {
    updateRecord('alerts', id, { is_read: true });
  });
};

export const deleteAlert = async (id: string): Promise<void> => {
  await withDemoNetwork(() => deleteRecord('alerts', id));
};

// Monthly Report APIs
export const getMonthlyReports = async (userId: string): Promise<MonthlyReport[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('monthly_reports'), userId).sort((a, b) => b.month.localeCompare(a.month))
  );

export const getMonthlyReport = async (
  userId: string,
  month: string
): Promise<MonthlyReport | null> =>
  withDemoNetwork(() =>
    filterByUser(getTable('monthly_reports'), userId).find((report) => report.month === month) ??
    null
  );

export const createMonthlyReport = async (
  report: Omit<MonthlyReport, 'id' | 'created_at'>
): Promise<MonthlyReport | null> =>
  withDemoNetwork(() =>
    insertRecord('monthly_reports', {
      ...report,
      id: generateDemoId('report'),
      created_at: nowIsoString(),
    })
  );

// Receipt APIs
export const getReceipts = async (userId: string): Promise<Receipt[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('receipts'), userId).sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
  );

export const createReceipt = async (
  receipt: Omit<Receipt, 'id' | 'created_at'>
): Promise<Receipt | null> =>
  withDemoNetwork(() =>
    insertRecord('receipts', {
      ...receipt,
      id: generateDemoId('receipt'),
      created_at: nowIsoString(),
    })
  );

export const deleteReceipt = async (id: string): Promise<void> => {
  await withDemoNetwork(() => deleteRecord('receipts', id));
};

// Budget Plan APIs
export const getBudgetPlans = async (userId: string): Promise<BudgetPlan[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('budget_plans'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const createBudgetPlan = async (
  plan: Omit<BudgetPlan, 'id' | 'created_at'>
): Promise<BudgetPlan | null> =>
  withDemoNetwork(() =>
    insertRecord('budget_plans', {
      ...plan,
      id: generateDemoId('budget'),
      created_at: nowIsoString(),
    })
  );

// Spending Forecast APIs
export const getSpendingForecasts = async (
  userId: string
): Promise<SpendingForecast[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('spending_forecasts'), userId).sort((a, b) =>
      b.forecast_month.localeCompare(a.forecast_month)
    )
  );

export const createSpendingForecast = async (
  forecast: Omit<SpendingForecast, 'id' | 'created_at'>
): Promise<SpendingForecast | null> =>
  withDemoNetwork(() =>
    insertRecord('spending_forecasts', {
      ...forecast,
      id: generateDemoId('forecast'),
      created_at: nowIsoString(),
    })
  );

// Family Member APIs
export const getFamilyMembers = async (userId: string): Promise<FamilyMember[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('family_members'), userId).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  );

export const createFamilyMember = async (
  member: Omit<FamilyMember, 'id' | 'created_at'>
): Promise<FamilyMember | null> =>
  withDemoNetwork(() =>
    insertRecord('family_members', {
      ...member,
      id: generateDemoId('member'),
      created_at: nowIsoString(),
    })
  );

export const updateFamilyMember = async (
  id: string,
  updates: Partial<FamilyMember>
): Promise<FamilyMember | null> => withDemoNetwork(() => updateRecord('family_members', id, updates));

export const deleteFamilyMember = async (id: string): Promise<void> => {
  await withDemoNetwork(() => deleteRecord('family_members', id));
};

// Investment APIs
export const getInvestments = async (userId: string): Promise<Investment[]> =>
  withDemoNetwork(() =>
    filterByUser(getTable('investments'), userId).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  );

export const createInvestment = async (
  investment: Omit<Investment, 'id' | 'created_at' | 'updated_at'>
): Promise<Investment | null> =>
  withDemoNetwork(() => {
    const timestamp = nowIsoString();
    return insertRecord('investments', {
      ...investment,
      id: generateDemoId('investment'),
      created_at: timestamp,
      updated_at: timestamp,
    });
  });

export const updateInvestment = async (
  id: string,
  updates: Partial<Investment>
): Promise<Investment | null> =>
  withDemoNetwork(() =>
    updateRecord('investments', id, {
      ...updates,
      updated_at: nowIsoString(),
    })
  );

export const deleteInvestment = async (id: string): Promise<void> => {
  await withDemoNetwork(() => deleteRecord('investments', id));
};

// Combined financial data for predictions
export const getTotalFamilyIncome = async (userId: string): Promise<number> =>
  withDemoNetwork(() =>
    filterByUser(getTable('family_members'), userId)
      .filter((member) => member.is_active)
      .reduce((sum, member) => sum + Number(member.monthly_income), 0)
  );

export const getTotalInvestmentValue = async (userId: string): Promise<number> =>
  withDemoNetwork(() =>
    filterByUser(getTable('investments'), userId).reduce(
      (sum, investment) => sum + Number(investment.current_value),
      0
    )
  );
