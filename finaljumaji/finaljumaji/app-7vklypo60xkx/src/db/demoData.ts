import { demoUsers } from '@/config/demo';
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

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const isoDaysAgo = (days: number) => new Date(Date.now() - days * DAY_IN_MS).toISOString();
const isoDaysFromNow = (days: number) => new Date(Date.now() + days * DAY_IN_MS).toISOString();
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const touchTimestamps = (record: any, options?: { ensureCreated?: boolean; updateUpdated?: boolean }) => {
  const now = new Date().toISOString();
  if ('created_at' in record && (options?.ensureCreated || !record.created_at)) {
    record.created_at = record.created_at ?? now;
  }
  if ('updated_at' in record) {
    if (options?.updateUpdated) {
      record.updated_at = now;
    } else if (!record.updated_at) {
      record.updated_at = record.created_at ?? now;
    }
  }
};

const createTableStore = <T extends { id: string }>(prefix: string, initialRecords: T[]) => {
  let rows = initialRecords.map((record) => clone(record));

  return {
    list: () => rows.map((record) => clone(record)),
    filter: (predicate: (record: T) => boolean) => rows.filter(predicate).map((record) => clone(record)),
    findById: (id: string) => {
      const record = rows.find((row) => row.id === id);
      return record ? clone(record) : null;
    },
    insert: (record: Omit<T, 'id'> & Partial<Pick<T, 'id'>>) => {
      const newRecord = { ...record, id: record.id ?? generateId(prefix) } as T;
      touchTimestamps(newRecord, { ensureCreated: true, updateUpdated: true });
      rows = [newRecord, ...rows];
      return clone(newRecord);
    },
    update: (id: string, updates: Partial<T>) => {
      let updated: T | undefined;
      rows = rows.map((row) => {
        if (row.id !== id) return row;
        updated = { ...row, ...updates } as T;
        touchTimestamps(updated, { updateUpdated: true });
        return updated as T;
      });
      return updated ? clone(updated) : null;
    },
    remove: (id: string) => {
      rows = rows.filter((row) => row.id !== id);
    },
  };
};

const defaultUserId = demoUsers[0].id;

const profiles: Profile[] = demoUsers.map((user, index) => ({
  id: user.id,
  email: user.email,
  phone: `+1 (415) 555-${(2100 + index * 37).toString().padStart(4, '0')}`,
  name: user.name,
  language_preference: 'en',
  primary_income_type: index === 2 ? 'freelance' : 'salary',
  role: 'user',
  created_at: isoDaysAgo(200 - index * 15),
  updated_at: isoDaysAgo(7 - index * 2),
}));

const familyMembersSeed: FamilyMember[] = [
  {
    id: 'member-alex',
    user_id: defaultUserId,
    name: 'Alex Martinez',
    relationship: 'self',
    email: 'alex@flowguide.demo',
    phone: '+1 (415) 555-2100',
    date_of_birth: '1991-04-12',
    occupation: 'Design Lead',
    monthly_income: 8200,
    is_active: true,
    avatar_url: null,
    created_at: isoDaysAgo(320),
  },
  {
    id: 'member-jamie',
    user_id: defaultUserId,
    name: 'Jamie Wu',
    relationship: 'spouse',
    email: 'jamie@flowguide.demo',
    phone: '+1 (415) 555-2144',
    date_of_birth: '1990-07-05',
    occupation: 'Pediatric Nurse',
    monthly_income: 5100,
    is_active: true,
    avatar_url: null,
    created_at: isoDaysAgo(300),
  },
  {
    id: 'member-mila',
    user_id: defaultUserId,
    name: 'Mila Martinez',
    relationship: 'child',
    email: null,
    phone: null,
    date_of_birth: '2020-08-18',
    occupation: null,
    monthly_income: 0,
    is_active: true,
    avatar_url: null,
    created_at: isoDaysAgo(200),
  },
];

const transactionsSeed: Transaction[] = [
  {
    id: 'txn-salary',
    user_id: defaultUserId,
    member_id: null,
    type: 'income',
    amount: 5400,
    category: 'Salary',
    description: 'Brightwave Health payroll',
    date: isoDaysAgo(4),
    created_at: isoDaysAgo(4),
  },
  {
    id: 'txn-freelance',
    user_id: defaultUserId,
    member_id: null,
    type: 'income',
    amount: 1200,
    category: 'Freelance',
    description: 'Brand sprint for Nimbus Labs',
    date: isoDaysAgo(11),
    created_at: isoDaysAgo(11),
  },
  {
    id: 'txn-mortgage',
    user_id: defaultUserId,
    member_id: null,
    type: 'expense',
    amount: 2100,
    category: 'Housing',
    description: 'Mortgage payment',
    date: isoDaysAgo(2),
    created_at: isoDaysAgo(2),
  },
  {
    id: 'txn-groceries',
    user_id: defaultUserId,
    member_id: null,
    type: 'expense',
    amount: 265.4,
    category: 'Groceries',
    description: 'Weekly family groceries',
    date: isoDaysAgo(3),
    created_at: isoDaysAgo(3),
  },
  {
    id: 'txn-childcare',
    user_id: defaultUserId,
    member_id: null,
    type: 'expense',
    amount: 680,
    category: 'Childcare',
    description: 'Daycare tuition',
    date: isoDaysAgo(6),
    created_at: isoDaysAgo(6),
  },
  {
    id: 'txn-utilities',
    user_id: defaultUserId,
    member_id: null,
    type: 'expense',
    amount: 145.23,
    category: 'Utilities',
    description: 'Energy + water',
    date: isoDaysAgo(5),
    created_at: isoDaysAgo(5),
  },
  {
    id: 'txn-investment',
    user_id: defaultUserId,
    member_id: null,
    type: 'expense',
    amount: 450,
    category: 'Investments',
    description: 'Brokerage auto-invest',
    date: isoDaysAgo(8),
    created_at: isoDaysAgo(8),
  },
];

const billsSeed: Bill[] = [
  {
    id: 'bill-mortgage',
    user_id: defaultUserId,
    name: 'Mortgage Payment',
    amount: 2100,
    due_date: isoDaysFromNow(5),
    status: 'upcoming',
    category: 'Housing',
    created_at: isoDaysAgo(20),
  },
  {
    id: 'bill-internet',
    user_id: defaultUserId,
    name: 'Fiber Internet',
    amount: 95,
    due_date: isoDaysAgo(7),
    status: 'paid',
    category: 'Utilities',
    created_at: isoDaysAgo(60),
  },
  {
    id: 'bill-card',
    user_id: defaultUserId,
    name: 'Travel Rewards Card',
    amount: 640,
    due_date: isoDaysFromNow(10),
    status: 'upcoming',
    category: 'Credit Cards',
    created_at: isoDaysAgo(18),
  },
];

const goalsSeed: Goal[] = [
  {
    id: 'goal-emergency',
    user_id: defaultUserId,
    name: 'Emergency Fund',
    target_amount: 20000,
    current_amount: 12500,
    deadline: isoDaysFromNow(240),
    created_at: isoDaysAgo(150),
  },
  {
    id: 'goal-vacation',
    user_id: defaultUserId,
    name: 'Summer Adventure',
    target_amount: 6000,
    current_amount: 2500,
    deadline: isoDaysFromNow(120),
    created_at: isoDaysAgo(90),
  },
  {
    id: 'goal-remodel',
    user_id: defaultUserId,
    name: 'Kitchen Remodel',
    target_amount: 15000,
    current_amount: 4800,
    deadline: isoDaysFromNow(300),
    created_at: isoDaysAgo(60),
  },
];

const investmentsSeed: Investment[] = [
  {
    id: 'inv-vti',
    user_id: defaultUserId,
    member_id: 'member-alex',
    name: 'Vanguard Total Market',
    type: 'stocks',
    initial_amount: 10000,
    current_value: 14250,
    purchase_date: isoDaysAgo(420),
    expected_return_rate: 8,
    notes: 'Automated contribution every payday',
    created_at: isoDaysAgo(420),
    updated_at: isoDaysAgo(5),
  },
  {
    id: 'inv-savings',
    user_id: defaultUserId,
    member_id: 'member-jamie',
    name: 'High Yield Savings',
    type: 'other',
    initial_amount: 7000,
    current_value: 7150,
    purchase_date: isoDaysAgo(280),
    expected_return_rate: 4.8,
    notes: 'Emergency reserve bucket',
    created_at: isoDaysAgo(280),
    updated_at: isoDaysAgo(9),
  },
  {
    id: 'inv-reit',
    user_id: defaultUserId,
    member_id: null,
    name: 'Greenbuild REIT',
    type: 'real_estate',
    initial_amount: 5000,
    current_value: 5600,
    purchase_date: isoDaysAgo(365),
    expected_return_rate: 6.3,
    notes: 'Quarterly dividend reinvested',
    created_at: isoDaysAgo(365),
    updated_at: isoDaysAgo(30),
  },
];

const alertsSeed: Alert[] = [
  {
    id: 'alert-low-balance',
    user_id: defaultUserId,
    type: 'low_balance',
    title: 'Balance dipped below $1,000',
    message: 'Cover childcare expenses with the checking buffer or transfer from HYSA.',
    severity: 'critical',
    is_read: false,
    created_at: isoDaysAgo(1),
  },
  {
    id: 'alert-bill',
    user_id: defaultUserId,
    type: 'bill_due',
    title: 'Mortgage due in 5 days',
    message: 'Schedule your payment to keep the on-time streak going.',
    severity: 'warning',
    is_read: false,
    created_at: isoDaysAgo(2),
  },
  {
    id: 'alert-goal',
    user_id: defaultUserId,
    type: 'goal_behind',
    title: 'Emergency fund pacing',
    message: 'You are 62% funded. Add $500 this week to stay green.',
    severity: 'info',
    is_read: true,
    created_at: isoDaysAgo(5),
  },
  {
    id: 'alert-spend',
    user_id: defaultUserId,
    type: 'overspend_warning',
    title: 'Dining out is trending high',
    message: 'Consider one less takeout night to stay within budget.',
    severity: 'warning',
    is_read: true,
    created_at: isoDaysAgo(7),
  },
];

const adviceHistorySeed: AdviceHistory[] = [
  {
    id: 'advice-emergency',
    user_id: defaultUserId,
    category: 'emergency',
    question: 'How much should we keep in cash buffers?',
    answer: 'Target $24K for a 3-month runway given your burn. You are halfway there—keep auto-transfers on.',
    created_at: isoDaysAgo(15),
  },
  {
    id: 'advice-savings',
    user_id: defaultUserId,
    category: 'savings',
    question: 'Are we investing enough toward retirement?',
    answer: 'Increasing the 401(k) deferral by 2% covers the shortfall while keeping monthly cash flow healthy.',
    created_at: isoDaysAgo(28),
  },
  {
    id: 'advice-planning',
    user_id: defaultUserId,
    category: 'planning',
    question: 'Best way to fund the kitchen remodel?',
    answer: 'Blend savings with a low-rate HELOC draw so you maintain liquidity for emergencies.',
    created_at: isoDaysAgo(40),
  },
];

const voiceSmsHistorySeed: VoiceSmsHistory[] = [
  {
    id: 'voice-checkin',
    user_id: defaultUserId,
    type: 'voice',
    content: 'Called FlowGuide assistant to move $500 into HYSA.',
    summary: 'Transfer completed; reminder set for next paycheck.',
    created_at: isoDaysAgo(6),
  },
  {
    id: 'sms-alert',
    user_id: defaultUserId,
    type: 'sms',
    content: 'Texted "status" to confirm mortgage autopay.',
    summary: 'Autopay confirmed for March 1st.',
    created_at: isoDaysAgo(12),
  },
];

const safetyLogsSeed: SafetyLog[] = [
  {
    id: 'safety-spend',
    user_id: defaultUserId,
    log_type: 'inconsistency',
    description: 'Detected duplicate grocery transaction. Flagged for review.',
    risk_score: 12,
    created_at: isoDaysAgo(9),
  },
  {
    id: 'safety-voice',
    user_id: defaultUserId,
    log_type: 'fallback',
    description: 'Voice command timed out. Prompted user to retry via SMS.',
    risk_score: 6,
    created_at: isoDaysAgo(3),
  },
];

const monthlyReportsSeed: MonthlyReport[] = [
  {
    id: 'report-2025-02',
    user_id: defaultUserId,
    month: '2025-02',
    total_income: 8200,
    total_expenses: 6120,
    biggest_category: 'Housing',
    biggest_category_amount: 2100,
    good_habits: ['Automated savings hit target', 'Credit card in grace period'],
    bad_habits: ['Dining out trending +18%'],
    suggestions: ['Lock in HELOC refinance while rates dip'],
    created_at: isoDaysAgo(10),
  },
  {
    id: 'report-2025-01',
    user_id: defaultUserId,
    month: '2025-01',
    total_income: 7900,
    total_expenses: 5980,
    biggest_category: 'Childcare',
    biggest_category_amount: 820,
    good_habits: ['Invested windfall bonus'],
    bad_habits: ['Utilities over baseline during cold snap'],
    suggestions: ['Schedule home energy audit'],
    created_at: isoDaysAgo(40),
  },
  {
    id: 'report-2024-12',
    user_id: defaultUserId,
    month: '2024-12',
    total_income: 7800,
    total_expenses: 6400,
    biggest_category: 'Gifts',
    biggest_category_amount: 950,
    good_habits: ['Year-end Roth contribution complete'],
    bad_habits: ['Subscription creep of +$42/mo'],
    suggestions: ['Audit subscriptions before Q2'],
    created_at: isoDaysAgo(70),
  },
];

const receiptsSeed: Receipt[] = [
  {
    id: 'receipt-grocery',
    user_id: defaultUserId,
    image_url: null,
    amount: 112.45,
    merchant: 'Whole Harvest Market',
    date: isoDaysAgo(5),
    category: 'Groceries',
    tax_amount: 8.12,
    extracted_data: { items: 24, payment: 'VISA 4321' },
    created_at: isoDaysAgo(5),
  },
  {
    id: 'receipt-hardware',
    user_id: defaultUserId,
    image_url: null,
    amount: 286.9,
    merchant: 'Mission Hardware',
    date: isoDaysAgo(9),
    category: 'Home',
    tax_amount: 21.05,
    extracted_data: { project: 'Backyard planter' },
    created_at: isoDaysAgo(9),
  },
];

const budgetPlansSeed: BudgetPlan[] = [
  {
    id: 'budget-2025',
    user_id: defaultUserId,
    age: 34,
    income: 168000,
    responsibilities: 'Mortgage, daycare, car lease',
    fixed_expenses: 72000,
    lifestyle: 'Balanced',
    budget_percentages: { needs: 55, wants: 25, goals: 20 },
    savings_plan: 'Automate $1,650/mo split between HYSA and brokerage accounts.',
    emergency_fund_target: 24000,
    investment_split: { stocks: 60, bonds: 20, cash: 20 },
    created_at: isoDaysAgo(25),
  },
];

const spendingForecastsSeed: SpendingForecast[] = [
  {
    id: 'forecast-mar',
    user_id: defaultUserId,
    forecast_month: '2025-03',
    predicted_expenses: 6200,
    predicted_income: 8300,
    cash_shortage_date: null,
    overspend_risk: 'medium',
    safe_to_spend: 1850,
    confidence_score: 82,
    created_at: isoDaysAgo(5),
  },
  {
    id: 'forecast-apr',
    user_id: defaultUserId,
    forecast_month: '2025-04',
    predicted_expenses: 6400,
    predicted_income: 8400,
    cash_shortage_date: null,
    overspend_risk: 'low',
    safe_to_spend: 2100,
    confidence_score: 78,
    created_at: isoDaysAgo(2),
  },
];

const profilesStore = createTableStore<Profile>('profile', profiles);
const transactionsStore = createTableStore<Transaction>('txn', transactionsSeed);
const billsStore = createTableStore<Bill>('bill', billsSeed);
const goalsStore = createTableStore<Goal>('goal', goalsSeed);
const familyMembersStore = createTableStore<FamilyMember>('member', familyMembersSeed);
const investmentsStore = createTableStore<Investment>('inv', investmentsSeed);
const alertsStore = createTableStore<Alert>('alert', alertsSeed);
const adviceStore = createTableStore<AdviceHistory>('advice', adviceHistorySeed);
const voiceSmsStore = createTableStore<VoiceSmsHistory>('voice', voiceSmsHistorySeed);
const safetyLogsStore = createTableStore<SafetyLog>('safety', safetyLogsSeed);
const monthlyReportsStore = createTableStore<MonthlyReport>('report', monthlyReportsSeed);
const receiptsStore = createTableStore<Receipt>('receipt', receiptsSeed);
const budgetPlanStore = createTableStore<BudgetPlan>('budget', budgetPlansSeed);
const spendingForecastStore = createTableStore<SpendingForecast>('forecast', spendingForecastsSeed);

const sortByDateDesc = <T>(items: T[], extractor: (item: T) => string) =>
  items.sort((a, b) => new Date(extractor(b)).getTime() - new Date(extractor(a)).getTime());

export const demoData = {
  getProfile: (userId: string): Profile | null => profilesStore.findById(userId),
  updateProfile: (userId: string, updates: Partial<Profile>) => profilesStore.update(userId, updates),

  getTransactions: (userId: string, limit = 50) =>
    sortByDateDesc(
      transactionsStore.filter((txn) => txn.user_id === userId),
      (txn) => txn.date
    ).slice(0, limit),
  createTransaction: (payload: Omit<Transaction, 'id' | 'created_at'>) =>
    transactionsStore.insert(payload),
  updateTransaction: (id: string, updates: Partial<Transaction>) => transactionsStore.update(id, updates),
  deleteTransaction: (id: string) => transactionsStore.remove(id),

  getBills: (userId: string) =>
    billsStore
      .filter((bill) => bill.user_id === userId)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()),
  createBill: (payload: Omit<Bill, 'id' | 'created_at'>) => billsStore.insert(payload),
  updateBill: (id: string, updates: Partial<Bill>) => billsStore.update(id, updates),
  deleteBill: (id: string) => billsStore.remove(id),

  getGoals: (userId: string) =>
    goalsStore
      .filter((goal) => goal.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createGoal: (payload: Omit<Goal, 'id' | 'created_at'>) => goalsStore.insert(payload),
  updateGoal: (id: string, updates: Partial<Goal>) => goalsStore.update(id, updates),
  deleteGoal: (id: string) => goalsStore.remove(id),

  getFamilyMembers: (userId: string) =>
    familyMembersStore
      .filter((member) => member.user_id === userId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
  createFamilyMember: (payload: Omit<FamilyMember, 'id' | 'created_at'>) => familyMembersStore.insert(payload),
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => familyMembersStore.update(id, updates),
  deleteFamilyMember: (id: string) => familyMembersStore.remove(id),

  getInvestments: (userId: string) =>
    investmentsStore
      .filter((investment) => investment.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createInvestment: (payload: Omit<Investment, 'id' | 'created_at' | 'updated_at'>) =>
    investmentsStore.insert(payload),
  updateInvestment: (id: string, updates: Partial<Investment>) => investmentsStore.update(id, updates),
  deleteInvestment: (id: string) => investmentsStore.remove(id),

  getAlerts: (userId: string) =>
    alertsStore
      .filter((alert) => alert.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  getUnreadAlerts: (userId: string) =>
    alertsStore
      .filter((alert) => alert.user_id === userId && !alert.is_read)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createAlert: (payload: Omit<Alert, 'id' | 'created_at'>) => alertsStore.insert(payload),
  markAlertAsRead: (id: string) => {
    const updated = alertsStore.update(id, { is_read: true });
    if (!updated) {
      throw new Error('Alert not found');
    }
  },
  deleteAlert: (id: string) => alertsStore.remove(id),

  getAdviceHistory: (userId: string) =>
    adviceStore
      .filter((entry) => entry.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createAdviceHistory: (payload: Omit<AdviceHistory, 'id' | 'created_at'>) => adviceStore.insert(payload),

  getVoiceSmsHistory: (userId: string) =>
    voiceSmsStore
      .filter((entry) => entry.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createVoiceSmsHistory: (payload: Omit<VoiceSmsHistory, 'id' | 'created_at'>) =>
    voiceSmsStore.insert(payload),

  getSafetyLogs: (userId: string) =>
    safetyLogsStore
      .filter((log) => log.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createSafetyLog: (payload: Omit<SafetyLog, 'id' | 'created_at'>) => safetyLogsStore.insert(payload),

  getMonthlyReports: (userId: string) =>
    monthlyReportsStore
      .filter((report) => report.user_id === userId)
      .sort((a, b) => (a.month < b.month ? 1 : -1)),
  getMonthlyReport: (userId: string, month: string) =>
    monthlyReportsStore.filter((report) => report.user_id === userId && report.month === month)[0] ?? null,
  createMonthlyReport: (payload: Omit<MonthlyReport, 'id' | 'created_at'>) =>
    monthlyReportsStore.insert(payload),

  getReceipts: (userId: string) =>
    receiptsStore
      .filter((receipt) => receipt.user_id === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  createReceipt: (payload: Omit<Receipt, 'id' | 'created_at'>) => receiptsStore.insert(payload),
  deleteReceipt: (id: string) => receiptsStore.remove(id),

  getBudgetPlans: (userId: string) =>
    budgetPlanStore
      .filter((plan) => plan.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  createBudgetPlan: (payload: Omit<BudgetPlan, 'id' | 'created_at'>) => budgetPlanStore.insert(payload),

  getSpendingForecasts: (userId: string) =>
    spendingForecastStore
      .filter((forecast) => forecast.user_id === userId)
      .sort((a, b) => (a.forecast_month < b.forecast_month ? 1 : -1)),
  createSpendingForecast: (payload: Omit<SpendingForecast, 'id' | 'created_at'>) =>
    spendingForecastStore.insert(payload),
};
