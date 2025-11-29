export interface DemoUserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  title?: string;
  household?: string;
  location?: string;
  timezone?: string;
  bio?: string;
}

const normalizeBoolean = (value: string | undefined) => {
  if (!value) return undefined;
  const normalized = value.toString().trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return undefined;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);

const parsedDemoFlag = normalizeBoolean(import.meta.env.VITE_DEMO_MODE);
export const isDemoMode = parsedDemoFlag ?? !hasSupabaseCredentials;

export const DEMO_AUTH_STORAGE_KEY = 'flowguide.demo.user';

export const demoUsers: DemoUserProfile[] = [
  {
    id: 'demo-alex',
    name: 'Alex Martinez',
    email: 'alex@flowguide.demo',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Alex%20Martinez',
    title: 'Design Lead, Brightwave Health',
    household: 'Martinez Family',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    bio: 'Running a dual-income household with a toddler while optimizing investments and savings.',
  },
  {
    id: 'demo-jordan',
    name: 'Jordan Singh',
    email: 'jordan@flowguide.demo',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Jordan%20Singh',
    title: 'Operations Director, Northwind Logistics',
    household: 'Singh Household',
    location: 'Seattle, WA',
    timezone: 'America/Los_Angeles',
    bio: 'Balancing college savings with aggressive retirement goals for a growing family.',
  },
  {
    id: 'demo-maya',
    name: 'Maya Chen',
    email: 'maya@flowguide.demo',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Maya%20Chen',
    title: 'Product Marketing Lead, Stellar AI',
    household: 'Chen Household',
    location: 'Austin, TX',
    timezone: 'America/Chicago',
    bio: 'First-time homeowner focused on crushing student loans and building an investment habit.',
  },
];

export const defaultDemoUser = demoUsers[0];

export const getDemoUserById = (id: string) => demoUsers.find((user) => user.id === id);
