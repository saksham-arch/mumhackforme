a
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchRate } from '@/lib/currency';

type CurrencyState = {
  currency: 'USD' | 'INR';
  rate: number | null; // USD -> INR rate
  setCurrency: (c: 'USD' | 'INR') => void;
  refresh: () => Promise<void>;
};

const CurrencyContext = createContext<CurrencyState | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<'USD' | 'INR'>(() => {
    try {
      const v = localStorage.getItem('preferredCurrency');
      return (v as any) === 'INR' ? 'INR' : 'USD';
    } catch (e) {
      return 'USD';
    }
  });

  const [rate, setRate] = useState<number | null>(null);

  const setCurrency = (c: 'USD' | 'INR') => {
    setCurrencyState(c);
    try {
      localStorage.setItem('preferredCurrency', c);
    } catch {}
  };

  const refresh = async () => {
    const r = await fetchRate('USD', 'INR');
    if (r) setRate(r);
  };

  useEffect(() => {
    refresh();
    // refresh every 6 hours
    const id = setInterval(refresh, 1000 * 60 * 60 * 6);
    return () => clearInterval(id);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, rate, setCurrency, refresh }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
