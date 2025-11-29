import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMonthlyReports, createMonthlyReport, getTransactions } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import type { MonthlyReport } from '@/types/types';
import { TrendingUp, TrendingDown, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function MonthlyReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getMonthlyReports(user.id);
      setReports(data);
    } catch (error: any) {
      toast({
        title: 'Error loading reports',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    if (!user) return;

    setIsGenerating(true);

    try {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const monthStart = startOfMonth(lastMonth);
      const monthEnd = endOfMonth(lastMonth);

      const transactions = await getTransactions(user.id, 1000);
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const categoryTotals: Record<string, number> = {};
      monthTransactions
        .filter((t) => t.type === 'expense' && t.category)
        .forEach((t) => {
          const cat = t.category || 'Other';
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount);
        });

      const biggestCategory = Object.entries(categoryTotals).sort(
        ([, a], [, b]) => b - a
      )[0];

      const goodHabits = [
        income > expenses ? 'Maintained positive cash flow' : null,
        monthTransactions.length > 10 ? 'Actively tracking expenses' : null,
        'Consistent financial monitoring',
      ].filter(Boolean) as string[];

      const badHabits = [
        expenses > income ? 'Spending exceeded income' : null,
        biggestCategory && biggestCategory[1] > income * 0.4
          ? `High spending in ${biggestCategory[0]}`
          : null,
      ].filter(Boolean) as string[];

      const suggestions = [
        expenses > income
          ? 'Consider reducing discretionary spending'
          : 'Great job! Consider increasing savings',
        biggestCategory
          ? `Review your ${biggestCategory[0]} expenses for optimization`
          : 'Track your expenses by category for better insights',
        'Set up automatic savings transfers',
      ];

      await createMonthlyReport({
        user_id: user.id,
        month: format(monthStart, 'yyyy-MM-dd'),
        total_income: income,
        total_expenses: expenses,
        biggest_category: biggestCategory ? biggestCategory[0] : null,
        biggest_category_amount: biggestCategory ? biggestCategory[1] : null,
        good_habits: goodHabits,
        bad_habits: badHabits,
        suggestions: suggestions,
      });

      toast({
        title: 'Report generated!',
        description: 'Your monthly financial report is ready',
      });

      loadReports();
    } catch (error: any) {
      toast({
        title: 'Error generating report',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Monthly Reports</h1>
            <p className="text-muted-foreground">
              AI-powered financial summaries — like Spotify Wrapped for your money
            </p>
          </div>

          <Button onClick={generateReport} disabled={isGenerating} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : reports.length === 0 ? (
          <Card className="border-thin shadow-card">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No reports yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate your first monthly financial report to see insights
                  </p>
                  <Button onClick={generateReport} disabled={isGenerating}>
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.id} className="border-thin shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{format(new Date(report.month), 'MMMM yyyy')}</span>
                    <span
                      className={`text-sm font-normal ${
                        report.total_income >= report.total_expenses
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {report.total_income >= report.total_expenses ? (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Positive
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4" />
                          Negative
                        </span>
                      )}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="p-4 bg-accent rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                      <p className="text-2xl font-bold">
                        ${Number(report.total_income).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                      <p className="text-2xl font-bold">
                        ${Number(report.total_expenses).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {report.biggest_category && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Biggest Category</h3>
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span>{report.biggest_category}</span>
                          <span className="font-semibold">
                            ${Number(report.biggest_category_amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {report.good_habits && report.good_habits.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Good Habits
                      </h3>
                      <ul className="space-y-2">
                        {report.good_habits.map((habit, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span>✓</span>
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.bad_habits && report.bad_habits.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {report.bad_habits.map((habit, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span>•</span>
                            <span>{habit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {report.suggestions && report.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Suggestions
                      </h3>
                      <ul className="space-y-2">
                        {report.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span>→</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
