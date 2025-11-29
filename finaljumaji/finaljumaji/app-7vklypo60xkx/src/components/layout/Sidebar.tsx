import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'miaoda-auth-react';
import {
  LayoutDashboard,
  Wallet,
  Users,
  Sparkles,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
  { icon: Wallet, path: '/money', label: 'Finances' },
  { icon: Users, path: '/family', label: 'Family & Investments' },
  { icon: Sparkles, path: '/alerts', label: 'AI Insights' },
  { icon: Settings, path: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const location = useLocation();

  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto shadow-lg">
      <div className="px-6 py-8 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F864cef3a52df4f3d87a696e53a2e5346%2F066c776811b1438a9bdb5ecfc64ce4de?format=webp&width=200"
            alt="FlowGuide"
            className="h-10 w-auto opacity-100 group-hover:scale-105 transition-transform"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 relative group',
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border border-primary/30'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary to-purple-500 rounded-r-full" />
              )}
              <Icon
                className={cn(
                  'w-5 h-5 transition-all',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                )}
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-border/50">
        <Link
          to="/settings"
          className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted hover:from-muted to-muted/50 transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{user?.name ?? 'Account'}</div>
            <p className="text-xs text-muted-foreground truncate">
              {(user as any)?.familyName ?? 'View profile'}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
