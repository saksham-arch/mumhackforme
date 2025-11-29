import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import MyMoneyPage from './pages/MyMoneyPage';
import FinancesPage from './pages/FinancesPage';
import BillsPage from './pages/BillsPage';
import GoalsPage from './pages/GoalsPage';
import ReceiptScannerPage from './pages/ReceiptScannerPage';
import BudgetGeneratorPage from './pages/BudgetGeneratorPage';
import SpendingForecastPage from './pages/SpendingForecastPage';
import MonthlyReportsPage from './pages/MonthlyReportsPage';
import FamilyMembersPage from './pages/FamilyMembersPage';
import InvestmentsPage from './pages/InvestmentsPage';
import AlertsPage from './pages/AlertsPage';
import AdviceHistoryPage from './pages/AdviceHistoryPage';
import SafetyLogsPage from './pages/SafetyLogsPage';
import SettingsPage from './pages/SettingsPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Landing',
    path: '/',
    element: <LandingPage />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Signup',
    path: '/signup',
    element: <SignupPage />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    name: 'My Money',
    path: '/my-money',
    element: <MyMoneyPage />,
  },
  {
    name: 'Finances',
    path: '/money',
    element: <FinancesPage />,
  },
  {
    name: 'Bills',
    path: '/bills',
    element: <BillsPage />,
  },
  {
    name: 'Goals',
    path: '/goals',
    element: <GoalsPage />,
  },
  {
    name: 'Receipt Scanner',
    path: '/receipt-scanner',
    element: <ReceiptScannerPage />,
  },
  {
    name: 'Budget Generator',
    path: '/budget-generator',
    element: <BudgetGeneratorPage />,
  },
  {
    name: 'Spending Forecast',
    path: '/spending-forecast',
    element: <SpendingForecastPage />,
  },
  {
    name: 'Monthly Reports',
    path: '/monthly-reports',
    element: <MonthlyReportsPage />,
  },
  {
    name: 'Family Members',
    path: '/family',
    element: <FamilyMembersPage />,
  },
  {
    name: 'Investments',
    path: '/investments',
    element: <InvestmentsPage />,
  },
  {
    name: 'AI Insights',
    path: '/alerts',
    element: <AlertsPage />,
  },
  {
    name: 'Advice History',
    path: '/advice-history',
    element: <AdviceHistoryPage />,
  },
  {
    name: 'Safety Logs',
    path: '/safety-logs',
    element: <SafetyLogsPage />,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
  },
];

export default routes;
