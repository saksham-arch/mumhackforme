// Simple currency utilities: fetch exchange rates and format amounts.
export async function fetchRate(from = 'USD', to = 'INR') {
  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.rates?.[to] ?? null;
  } catch (err) {
    return null;
  }
}

export function convert(amount: number, rate: number | null) {
  if (!rate || Number.isNaN(Number(rate))) return amount;
  return amount * rate;
}

export function formatCurrency(amount: number, currency = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    // fallback
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  }
}
