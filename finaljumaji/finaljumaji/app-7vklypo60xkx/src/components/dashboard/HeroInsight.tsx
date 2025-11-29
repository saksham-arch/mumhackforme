import React from 'react';

type Props = {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  unreadAlerts?: number;
};

export default function HeroInsight({ balance, totalIncome, totalExpenses, unreadAlerts = 0 }: Props) {
  return (
    <div className="w-full rounded-lg bg-card p-6 shadow-card border-thin">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-[220px]">
          <p className="text-sm text-muted-foreground">Today's balance</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">${balance.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">Updated just now</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-md bg-primary/10 px-3 py-1">
              <p className="text-xs text-primary-foreground font-medium">Income</p>
              <p className="text-sm font-semibold text-primary">${totalIncome.toFixed(0)}</p>
            </div>

            <div className="rounded-md bg-muted px-3 py-1">
              <p className="text-xs text-muted-foreground font-medium">Expenses</p>
              <p className="text-sm font-semibold">${totalExpenses.toFixed(0)}</p>
            </div>

            <div className="rounded-md bg-muted px-3 py-1">
              <p className="text-xs text-muted-foreground font-medium">Alerts</p>
              <p className="text-sm font-semibold">{unreadAlerts}</p>
            </div>
          </div>
        </div>

        <div className="w-64 min-w-[220px] bg-gradient-card rounded-md p-3">
          <p className="text-xs text-muted-foreground">Quick Insights</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{Math.round((totalIncome || 1) / (totalExpenses || 1) * 100)}%</p>
              <p className="text-xs text-muted-foreground">Profit Index</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{Math.max(0, Math.round(balance))}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">{(unreadAlerts)}</p>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
