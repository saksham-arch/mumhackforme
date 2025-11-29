import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getBudgetPlans, createBudgetPlan } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import type { BudgetPlan } from '@/types/types';
import { Sparkles, PieChart } from 'lucide-react';

export default function BudgetGeneratorPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState({
    age: '',
    income: '',
    responsibilities: '',
    fixed_expenses: '',
    lifestyle: 'moderate',
  });

  useEffect(() => {
    if (user) {
      loadPlans();
    }
  }, [user]);

  const loadPlans = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getBudgetPlans(user.id);
      setPlans(data);
    } catch (error: any) {
      toast({
        title: 'Error loading plans',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsGenerating(true);

    try {
      const income = Number(formData.income);
      const fixedExpenses = Number(formData.fixed_expenses);
      const discretionary = income - fixedExpenses;

      const budgetPercentages = {
        housing: 30,
        food: 15,
        transportation: 10,
        savings: 20,
        entertainment: 10,
        healthcare: 5,
        other: 10,
      };

      const emergencyFund = income * 6;

      const investmentSplit = {
        stocks: 60,
        bonds: 30,
        cash: 10,
      };

      const savingsPlan = `Based on your income of $${income.toFixed(
        2
      )}, we recommend saving $${(income * 0.2).toFixed(
        2
      )} per month (20% of income). This will help you build a strong financial foundation.`;

      await createBudgetPlan({
        user_id: user.id,
        age: Number(formData.age) || null,
        income,
        responsibilities: formData.responsibilities || null,
        fixed_expenses: fixedExpenses,
        lifestyle: formData.lifestyle,
        budget_percentages: budgetPercentages,
        savings_plan: savingsPlan,
        emergency_fund_target: emergencyFund,
        investment_split: investmentSplit,
      });

      toast({
        title: 'Budget plan generated!',
        description: 'Your personalized budget plan is ready',
      });

      setFormData({
        age: '',
        income: '',
        responsibilities: '',
        fixed_expenses: '',
        lifestyle: 'moderate',
      });

      loadPlans();
    } catch (error: any) {
      toast({
        title: 'Error generating plan',
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
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Budget Generator</h1>
          <p className="text-muted-foreground">
            Create a personalized budget plan tailored to your life stage, income, and lifestyle
          </p>
        </div>

        <Card gradient variant="primary">
          <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-b border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Generate Your Budget Plan</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Answer a few questions to get personalized budget recommendations
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age" className="font-medium">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="border-thin bg-muted/50 focus:bg-background transition-colors"
                  />
                  <p className="text-xs text-muted-foreground">Optional - helps personalize your plan</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income" className="font-medium">Monthly Income *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="income"
                      type="number"
                      step="0.01"
                      placeholder="5000"
                      value={formData.income}
                      onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                      required
                      className="border-thin bg-muted/50 focus:bg-background pl-7 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixed_expenses" className="font-medium">Fixed Monthly Expenses *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="fixed_expenses"
                      type="number"
                      step="0.01"
                      placeholder="2000"
                      value={formData.fixed_expenses}
                      onChange={(e) =>
                        setFormData({ ...formData, fixed_expenses: e.target.value })
                      }
                      required
                      className="border-thin bg-muted/50 focus:bg-background pl-7 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Rent, utilities, insurance, etc.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lifestyle" className="font-medium">Lifestyle</Label>
                  <Select
                    value={formData.lifestyle}
                    onValueChange={(value) => setFormData({ ...formData, lifestyle: value })}
                  >
                    <SelectTrigger id="lifestyle" className="border-thin bg-muted/50 focus:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frugal">🌱 Frugal - Minimal spending</SelectItem>
                      <SelectItem value="moderate">💰 Moderate - Balanced approach</SelectItem>
                      <SelectItem value="comfortable">✨ Comfortable - Some luxury</SelectItem>
                      <SelectItem value="luxury">👑 Luxury - High spending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities" className="font-medium">Life Responsibilities (Optional)</Label>
                <Input
                  id="responsibilities"
                  placeholder="e.g., Single, Married, 2 Kids, Student, etc."
                  value={formData.responsibilities}
                  onChange={(e) =>
                    setFormData({ ...formData, responsibilities: e.target.value })
                  }
                  className="border-thin bg-muted/50 focus:bg-background transition-colors"
                />
              </div>

              <Button type="submit" disabled={isGenerating} className="w-full h-11 gap-2" size="lg">
                <Sparkles className="w-5 h-5" />
                {isGenerating ? 'Generating your plan...' : 'Generate Budget Plan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Your Budget Plans</h2>
              <p className="text-sm text-muted-foreground">
                {plans.length} plan{plans.length !== 1 ? 's' : ''} created
              </p>
            </div>
          </div>

          {isLoading ? (
            <Card gradient>
              <CardContent className="py-16">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-muted border-t-primary animate-spin mx-auto" />
                  <p className="text-muted-foreground">Loading your plans...</p>
                </div>
              </CardContent>
            </Card>
          ) : plans.length === 0 ? (
            <Card gradient variant="success">
              <CardContent className="py-16">
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg mx-auto flex items-center justify-center">
                    <PieChart className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No budget plans yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate your first AI-powered budget plan to get personalized recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {plans.map((plan) => (
                <Card key={plan.id} gradient variant="primary" className="hover:shadow-lg transition-all overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/20 to-purple-500/20 border-b border-primary/20">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <CardTitle className="text-xl mb-2">Budget Plan</CardTitle>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Monthly Income</p>
                            <p className="font-bold text-lg">
                              ${Number(plan.income).toFixed(2)}
                            </p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div>
                            <p className="text-muted-foreground">Lifestyle</p>
                            <p className="font-semibold capitalize">{plan.lifestyle}</p>
                          </div>
                        </div>
                      </div>
                      {plan.emergency_fund_target && (
                        <div className="text-right p-4 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Emergency Fund</p>
                          <p className="text-2xl font-bold">
                            ${Number(plan.emergency_fund_target).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6 space-y-6">
                    {plan.budget_percentages && (
                      <div>
                        <h4 className="text-base font-semibold mb-4">Recommended Budget Allocation</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(plan.budget_percentages).map(([key, value]) => (
                            <div
                              key={key}
                              className="p-4 bg-gradient-to-br from-muted/50 to-muted rounded-lg border border-border hover:border-primary/50 transition-all"
                            >
                              <p className="text-xs font-medium text-muted-foreground mb-2 capitalize">
                                {key}
                              </p>
                              <p className="text-2xl font-bold">{String(value)}%</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                ${(
                                  (Number(plan.income) * Number(value)) /
                                  100
                                ).toFixed(0)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {plan.savings_plan && (
                      <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2 text-green-700 dark:text-green-400">
                          💡 Savings Recommendation
                        </h4>
                        <p className="text-sm leading-relaxed">{plan.savings_plan}</p>
                      </div>
                    )}

                    {plan.investment_split && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Investment Split</h4>
                        <div className="space-y-2">
                          {Object.entries(plan.investment_split).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm capitalize font-medium">{key}</span>
                              <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary to-purple-500"
                                    style={{ width: `${value}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold w-12 text-right">
                                  {value}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
