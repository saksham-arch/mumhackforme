import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BarChart from '@/components/charts/BarChart';
import CircularProgress from '@/components/charts/CircularProgress';
import {
  getTransactions,
  getGoals,
  getFamilyMembers,
  getInvestments,
  getAlerts,
} from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays } from 'date-fns';
import type { Transaction, Goal, FamilyMember, Investment, Alert } from '@/types/types';
import {
  Search,
  Filter,
  User,
  Plus,
  ArrowRight,
  Calendar,
  MessageSquare,
  MoreVertical,
  Phone,
  TrendingUp,
  Target,
  Zap,
  Award,
  Heart,
  AlertCircle,
  LineChart,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [transactionsData, goalsData, membersData, investmentsData, alertsData] =
        await Promise.all([
          getTransactions(user.id),
          getGoals(user.id),
          getFamilyMembers(user.id),
          getInvestments(user.id),
          getAlerts(user.id),
        ]);

      setTransactions(transactionsData);
      setGoals(goalsData);
      setMembers(membersData);
      setInvestments(investmentsData);
      setAlerts(alertsData);
    } catch (error: any) {
      toast({
        title: 'Error loading dashboard',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyData = () => {
    const startDate = startOfWeek(new Date());
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return weekDays.map((day, index) => {
      const date = addDays(startDate, index);
      const dayTransactions = transactions.filter(
        (t) => format(new Date(t.date), 'EEE') === day
      );
      const income = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return { label: day, value: income };
    });
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const completedGoals = goals.filter(
    (g) => Number(g.current_amount) >= Number(g.target_amount)
  ).length;
  const goalsProgress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

  const unreadAlerts = alerts.filter((a) => !a.is_read).length;

  // Calculate Financial Health Score
  const calculateHealthScore = (): { score: number; level: string; color: string; recommendation: string } => {
    let score = 50; // Start with 50 points

    // Income vs Expenses ratio (max 20 points)
    if (totalIncome > 0) {
      const ratio = totalExpenses / totalIncome;
      if (ratio < 0.5) score += 20;
      else if (ratio < 0.7) score += 15;
      else if (ratio < 0.9) score += 10;
    }

    // Savings capability (max 15 points)
    const savings = balance;
    if (savings > 5000) score += 15;
    else if (savings > 2000) score += 10;
    else if (savings > 0) score += 5;

    // Goal progress (max 15 points)
    if (goalsProgress >= 75) score += 15;
    else if (goalsProgress >= 50) score += 10;
    else if (goalsProgress >= 25) score += 5;

    // Active investments (max 10 points)
    if (investments.length > 0) score += Math.min(10, investments.length * 3);

    // Family members tracked (max 10 points)
    if (members.length > 0) score += Math.min(10, members.length * 2);

    score = Math.min(100, score);

    let level = 'Poor';
    let color = 'text-red-600 dark:text-red-400';
    let recommendation = 'Focus on building your emergency fund';

    if (score >= 80) {
      level = 'Excellent';
      color = 'text-green-600 dark:text-green-400';
      recommendation = 'Keep up the great financial habits!';
    } else if (score >= 60) {
      level = 'Good';
      color = 'text-blue-600 dark:text-blue-400';
      recommendation = 'Consider increasing your savings rate';
    } else if (score >= 40) {
      level = 'Fair';
      color = 'text-amber-600 dark:text-amber-400';
      recommendation = 'Work on reducing expenses';
    }

    return { score: Math.round(score), level, color, recommendation };
  };

  const healthScore = calculateHealthScore();

  // Smart Insights
  const getInsights = () => {
    const insights = [];

    if (totalExpenses > totalIncome * 0.8) {
      insights.push({
        title: 'High Spending Alert',
        description: 'Your expenses are 80%+ of income',
        icon: AlertCircle,
        color: 'text-red-600 dark:text-red-400',
        actionable: true,
      });
    }

    if (balance > totalIncome * 2) {
      insights.push({
        title: 'Invest Your Surplus',
        description: 'You have significant savings to invest',
        icon: TrendingUp,
        color: 'text-green-600 dark:text-green-400',
        actionable: true,
      });
    }

    if (completedGoals === goals.length && goals.length > 0) {
      insights.push({
        title: 'All Goals Achieved! 🎉',
        description: 'You have completed all your financial goals',
        icon: Award,
        color: 'text-purple-600 dark:text-purple-400',
        actionable: false,
      });
    }

    if (insights.length === 0) {
      insights.push({
        title: 'Track More Transactions',
        description: 'Add more transaction data for better insights',
        icon: Heart,
        color: 'text-primary',
        actionable: false,
      });
    }

    return insights.slice(0, 3);
  };

  const financialStages = [
    {
      title: 'Planning',
      count: goals.filter((g) => Number(g.current_amount) === 0).length,
      items: goals
        .filter((g) => Number(g.current_amount) === 0)
        .slice(0, 3)
        .map((g) => ({
          name: g.name,
          description: `Target: $${Number(g.target_amount).toFixed(0)}`,
          date: g.deadline ? format(new Date(g.deadline), 'MMM d') : 'No deadline',
          progress: 0,
        })),
    },
    {
      title: 'In Progress',
      count: goals.filter(
        (g) =>
          Number(g.current_amount) > 0 && Number(g.current_amount) < Number(g.target_amount)
      ).length,
      items: goals
        .filter(
          (g) =>
            Number(g.current_amount) > 0 && Number(g.current_amount) < Number(g.target_amount)
        )
        .slice(0, 3)
        .map((g) => ({
          name: g.name,
          description: `$${Number(g.current_amount).toFixed(0)} / $${Number(
            g.target_amount
          ).toFixed(0)}`,
          date: g.deadline ? format(new Date(g.deadline), 'MMM d') : 'No deadline',
          progress: (Number(g.current_amount) / Number(g.target_amount)) * 100,
        })),
    },
    {
      title: 'Near Complete',
      count: goals.filter(
        (g) =>
          Number(g.current_amount) >= Number(g.target_amount) * 0.8 &&
          Number(g.current_amount) < Number(g.target_amount)
      ).length,
      items: goals
        .filter(
          (g) =>
            Number(g.current_amount) >= Number(g.target_amount) * 0.8 &&
            Number(g.current_amount) < Number(g.target_amount)
        )
        .slice(0, 3)
        .map((g) => ({
          name: g.name,
          description: `$${Number(g.current_amount).toFixed(0)} / $${Number(
            g.target_amount
          ).toFixed(0)}`,
          date: g.deadline ? format(new Date(g.deadline), 'MMM d') : 'No deadline',
          progress: (Number(g.current_amount) / Number(g.target_amount)) * 100,
        })),
    },
    {
      title: 'Achieved',
      count: completedGoals,
      items: goals
        .filter((g) => Number(g.current_amount) >= Number(g.target_amount))
        .slice(0, 3)
        .map((g) => ({
          name: g.name,
          description: `Completed: $${Number(g.target_amount).toFixed(0)}`,
          date: format(new Date(g.created_at), 'MMM d'),
          progress: 100,
        })),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-muted-foreground">Here's your financial overview for this month</p>
          </div>
          <a
            href="tel:+16087659446"
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
          >
            <Phone className="w-5 h-5" />
            <span className="hidden sm:inline">Call Support</span>
            <span className="sm:hidden">+1 (608) 765-9446</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card gradient variant="primary">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ${balance.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {balance >= 0 ? '↑ Positive' : '↓ Negative'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card gradient variant="success">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">${totalIncome.toFixed(2)}</p>
                <p className="text-xs text-green-600 dark:text-green-400">All sources</p>
              </div>
            </CardContent>
          </Card>

          <Card gradient variant="warning">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">${totalExpenses.toFixed(2)}</p>
                <p className="text-xs text-red-600 dark:text-red-400">This month</p>
              </div>
            </CardContent>
          </Card>

          <Card gradient variant="info">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{goals.length}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {completedGoals} completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card gradient variant="primary">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-3xl font-bold ${healthScore.color}`}>
                    {healthScore.score}
                  </p>
                  <span className={`text-xs font-semibold ${healthScore.color}`}>
                    {healthScore.level}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Financial wellness</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card gradient variant="primary" className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Smart Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{healthScore.recommendation}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getInsights().map((insight, idx) => {
                  const InsightIcon = insight.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg border border-border/50 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <InsightIcon className={`w-5 h-5 flex-shrink-0 ${insight.color}`} />
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                      {insight.actionable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3 text-primary hover:bg-primary/10 w-full justify-start"
                        >
                          Take Action <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {unreadAlerts > 0 && (
          <Card gradient variant="warning">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
                  <p className="text-sm font-medium">
                    {unreadAlerts} unread alert{unreadAlerts > 1 ? 's' : ''} requiring your attention
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/alerts')}
                  className="gap-2"
                >
                  View Alerts
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-thin bg-muted/50 focus:bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 border-thin">
                <Filter className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="gap-2 border-thin">
              <User className="w-4 h-4" />
              Me
            </Button>

            <Button className="gap-2" onClick={() => navigate('/money')}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card gradient variant="primary" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Weekly Income Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={getWeeklyData()} />
            </CardContent>
          </Card>

          <Card gradient variant="info">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Goals Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <CircularProgress percentage={Math.round(goalsProgress)} label="Achieved" />
              <p className="text-xs text-muted-foreground mt-4">
                {completedGoals} of {goals.length} goals
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Goals Timeline</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/goals')}
              className="gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialStages.map((stage, stageIndex) => (
              <div key={stageIndex} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted font-semibold text-sm">
                    {stage.count}
                  </div>
                  <h3 className="font-semibold text-sm">{stage.title}</h3>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stage.items.length === 0 ? (
                    <Card gradient>
                      <CardContent className="p-4 text-center">
                        <p className="text-xs text-muted-foreground">No items yet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    stage.items.map((item, itemIndex) => (
                      <Card
                        key={itemIndex}
                        gradient
                        className="hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer animate-fade-in"
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm mb-1 line-clamp-2">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </div>

                          {item.progress > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Progress</span>
                                <span className="font-medium">{Math.round(item.progress)}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {members.length > 0 && (
          <Card gradient>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Family Members</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/family')}
                  className="gap-2"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {members.slice(0, 6).map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-purple-500/40 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold truncate max-w-[80px]">{member.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {member.relationship}
                      </p>
                    </div>
                  </div>
                ))}
                {members.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/family')}
                    className="h-auto flex flex-col items-center justify-center gap-2 p-4"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-xs">More</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
