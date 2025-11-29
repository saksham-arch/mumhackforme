import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FinancesPage from './pages/FinancesPage';
import FamilyMembersPage from './pages/FamilyMembersPage';
import InvestmentsPage from './pages/InvestmentsPage';
import AlertsPage from './pages/AlertsPage';
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
    name: 'Finances',
    path: '/money',
    element: <FinancesPage />,
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
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
  },
];

export default routes;
