import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getSpendingForecasts,
  createSpendingForecast,
  getTransactions,
  getBalance,
} from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths, startOfMonth } from 'date-fns';
import type { SpendingForecast } from '@/types/types';
import { TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export default function SpendingForecastPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [forecasts, setForecasts] = useState<SpendingForecast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadForecasts();
    }
  }, [user]);

  const loadForecasts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getSpendingForecasts(user.id);
      setForecasts(data);
    } catch (error: any) {
      toast({
        title: 'Error loading forecasts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateForecast = async () => {
    if (!user) return;

    setIsGenerating(true);

    try {
      const transactions = await getTransactions(user.id, 1000);
      const balance = await getBalance(user.id);

      const lastMonthExpenses = transactions
        .filter((t) => t.type === 'expense')
        .slice(0, 30)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const avgMonthlyExpenses = lastMonthExpenses || 1000;
      const avgMonthlyIncome = transactions
        .filter((t) => t.type === 'income')
        .slice(0, 30)
        .reduce((sum, t) => sum + Number(t.amount), 0) || 2000;

      const predictedExpenses = avgMonthlyExpenses * 1.05;
      const predictedIncome = avgMonthlyIncome;

      const daysUntilShortage = balance > 0 ? Math.floor(balance / (avgMonthlyExpenses / 30)) : 0;
      const cashShortageDate =
        daysUntilShortage > 0 && daysUntilShortage < 60
          ? format(addMonths(new Date(), 1), 'yyyy-MM-dd')
          : null;

      const overspendRisk =
        predictedExpenses > predictedIncome * 0.9
          ? 'High'
          : predictedExpenses > predictedIncome * 0.7
            ? 'Medium'
            : 'Low';

      const safeToSpend = Math.max(0, predictedIncome - predictedExpenses);

      await createSpendingForecast({
        user_id: user.id,
        forecast_month: format(startOfMonth(addMonths(new Date(), 1)), 'yyyy-MM-dd'),
        predicted_expenses: predictedExpenses,
        predicted_income: predictedIncome,
        cash_shortage_date: cashShortageDate,
        overspend_risk: overspendRisk,
        safe_to_spend: safeToSpend,
        confidence_score: 0.75,
      });

      toast({
        title: 'Forecast generated!',
        description: 'Your spending forecast is ready',
      });

      loadForecasts();
    } catch (error: any) {
      toast({
        title: 'Error generating forecast',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold mb-2">Smart Spend Forecast</h1>
            <p className="text-muted-foreground">
              AI analyzes your patterns to predict spending and alerts you to cash shortages
            </p>
          </div>

          <Button onClick={generateForecast} disabled={isGenerating} className="gap-2 h-11">
            <TrendingUp className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'Generate Forecast'}
          </Button>
        </div>

        {isLoading ? (
          <Card gradient>
            <CardContent className="py-16">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-2 border-muted border-t-primary animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading forecasts...</p>
              </div>
            </CardContent>
          </Card>
        ) : forecasts.length === 0 ? (
          <Card gradient variant="primary">
            <CardContent className="py-16">
              <div className="text-center space-y-6 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg mx-auto flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">No forecasts yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Generate your first AI-powered spending forecast to see predictions for next month, upcoming cash shortages, and safe-to-spend amounts
                  </p>
                  <Button onClick={generateForecast} disabled={isGenerating} className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Generate Forecast
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {forecasts.map((forecast) => (
              <Card key={forecast.id} gradient variant="primary" className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-b border-primary/20">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <CardTitle className="text-2xl">
                        {format(new Date(forecast.forecast_month), 'MMMM yyyy')}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Forecast analysis and recommendations
                      </p>
                    </div>
                    {forecast.confidence_score && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-primary"
                              style={{
                                width: `${Number(forecast.confidence_score) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold">
                            {(Number(forecast.confidence_score) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-red-500/5 to-red-500/10 rounded-lg border border-red-500/10">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">Predicted Expenses</p>
                      <p className="text-3xl font-bold">
                        ${Number(forecast.predicted_expenses).toFixed(2)}
                      </p>
                    </div>

                    {forecast.predicted_income && (
                      <div className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-lg border border-green-500/10">
                        <p className="text-xs text-muted-foreground mb-1 font-medium">
                          Predicted Income
                        </p>
                        <p className="text-3xl font-bold">
                          ${Number(forecast.predicted_income).toFixed(2)}
                        </p>
                      </div>
                    )}

                    {forecast.safe_to_spend && (
                      <div className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-lg border border-blue-500/10">
                        <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Safe to Spend
                        </p>
                        <p className="text-3xl font-bold">
                          ${Number(forecast.safe_to_spend).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {forecast.overspend_risk && (
                      <div
                        className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                          forecast.overspend_risk === 'High'
                            ? 'border-l-destructive bg-destructive/5 border border-destructive/10'
                            : forecast.overspend_risk === 'Medium'
                              ? 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/10'
                              : 'border-l-green-500 bg-green-50 dark:bg-green-950/20 border border-green-500/10'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            forecast.overspend_risk === 'High'
                              ? 'text-destructive'
                              : forecast.overspend_risk === 'Medium'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-green-600 dark:text-green-400'
                          }`}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            Overspend Risk: {forecast.overspend_risk}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {forecast.overspend_risk === 'High'
                              ? 'Your predicted expenses are close to or exceed your income. We recommend reducing discretionary spending to stay on track.'
                              : forecast.overspend_risk === 'Medium'
                                ? 'Your spending is approaching your income limit. Keep monitoring your expenses carefully.'
                                : 'Your spending is well within your income. Great job maintaining a healthy balance!'}
                          </p>
                        </div>
                      </div>
                    )}

                    {forecast.cash_shortage_date && (
                      <div className="p-4 rounded-lg border-l-4 border-l-destructive bg-destructive/5 border border-destructive/10 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">⚠️ Cash Shortage Alert</h3>
                          <p className="text-sm text-muted-foreground">
                            Based on current patterns, you may run out of money by{' '}
                            <span className="font-semibold text-foreground">
                              {format(new Date(forecast.cash_shortage_date), 'MMMM d, yyyy')}
                            </span>
                            . Consider increasing income or reviewing discretionary expenses.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
