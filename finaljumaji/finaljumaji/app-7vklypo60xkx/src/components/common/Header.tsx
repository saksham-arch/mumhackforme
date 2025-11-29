import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../../routes';
import { useAuth } from 'miaoda-auth-react';
import CallButton from '@/components/common/CallButton';
import ThemeToggle from '@/components/common/ThemeToggle';
import CurrencyToggle from '@/components/common/CurrencyToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const navigation = routes.filter((route) => route.visible !== false);
  const { user } = useAuth();
  const u = user as any;

  return (
    <header className="sticky top-0 z-10 shadow-md bg-gradient-primary text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Use the provided flow guide logo from public images */}
              <img
                className="h-10 w-auto"
                src="/images/flowguide-logo.svg"
                alt="Flow Guide"
              />
              <span className="ml-3 text-lg font-extrabold tracking-tight">
                Flow Guide
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-base font-medium rounded-md transition duration-300 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-white/15 to-white/5 text-white'
                    : 'text-white/90 hover:brightness-110'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Currency toggle */}
            <CurrencyToggle />

            {/* Call button - integrates with Twilio backend if available or falls back to tel: */}
            <CallButton phoneNumber="+16087659446" />

            {/* User account display */}
            <Link to="/settings" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-semibold text-sm">
                {u?.name ? u.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-sm leading-tight">
                <span className="font-medium">{u?.name ?? u?.email ?? 'Account'}</span>
                <span className="text-xs text-white/80">View profile</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
