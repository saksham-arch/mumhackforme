import { useEffect, useState } from 'react';
import { useCurrency } from '@/hooks/use-currency';
import { formatCurrency, convert } from '@/lib/currency';

export default function CurrencyToggle() {
  const { currency, rate, setCurrency, refresh } = useCurrency();
  const [sampleUSD] = useState(49.99);

  useEffect(() => {
    // ensure rate is fresh on mount
    refresh().catch(() => {});
  }, []);

  const displayed = currency === 'USD' ? formatCurrency(sampleUSD, 'USD') : formatCurrency(convert(sampleUSD, rate), 'INR');

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
        className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
        aria-label="Toggle currency"
      >
        {currency}
      </button>
      <div className="text-sm text-white/90 hidden sm:block">{displayed}</div>
    </div>
  );
}
