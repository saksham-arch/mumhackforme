import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getTransactions,
  createTransaction,
  getBills,
  createBill,
  updateBill,
  getGoals,
  createGoal,
  updateGoal,
  getFamilyMembers,
} from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Transaction, Bill, Goal, FamilyMember } from '@/types/types';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Receipt,
  Target,
  DollarSign,
  Calendar,
  Edit,
  Check,
} from 'lucide-react';

export default function FinancesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isBillDialogOpen, setIsBillDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    member_id: '',
  });

  const [billForm, setBillForm] = useState({
    name: '',
    amount: '',
    due_date: '',
    category: '',
  });

  const [goalForm, setGoalForm] = useState({
    name: '',
    target_amount: '',
    current_amount: '',
    deadline: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [transactionsData, billsData, goalsData, membersData] = await Promise.all([
        getTransactions(user.id),
        getBills(user.id),
        getGoals(user.id),
        getFamilyMembers(user.id),
      ]);

      setTransactions(transactionsData);
      setBills(billsData);
      setGoals(goalsData);
      setMembers(membersData);
    } catch (error: any) {
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createTransaction({
        user_id: user.id,
        member_id: transactionForm.member_id || null,
        type: transactionForm.type,
        amount: Number(transactionForm.amount),
        category: transactionForm.category || null,
        description: transactionForm.description || null,
        date: transactionForm.date,
      });

      toast({
        title: 'Transaction added',
        description: 'Your transaction has been recorded',
      });

      setIsTransactionDialogOpen(false);
      setTransactionForm({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        member_id: '',
      });

      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createBill({
        user_id: user.id,
        name: billForm.name,
        amount: Number(billForm.amount),
        due_date: billForm.due_date,
        status: 'upcoming',
        category: billForm.category || null,
      });

      toast({
        title: 'Bill added',
        description: 'Your bill has been added',
      });

      setIsBillDialogOpen(false);
      setBillForm({
        name: '',
        amount: '',
        due_date: '',
        category: '',
      });

      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createGoal({
        user_id: user.id,
        name: goalForm.name,
        target_amount: Number(goalForm.target_amount),
        current_amount: Number(goalForm.current_amount) || 0,
        deadline: goalForm.deadline || null,
      });

      toast({
        title: 'Goal added',
        description: 'Your goal has been created',
      });

      setIsGoalDialogOpen(false);
      setGoalForm({
        name: '',
        target_amount: '',
        current_amount: '',
        deadline: '',
      });

      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleMarkBillPaid = async (bill: Bill) => {
    try {
      await updateBill(bill.id, { status: 'paid' });
      toast({
        title: 'Bill marked as paid',
        description: `${bill.name} has been marked as paid`,
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const upcomingBills = bills.filter((b) => b.status === 'upcoming');
  const paidBills = bills.filter((b) => b.status === 'paid');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Finances</h1>
            <p className="text-muted-foreground">
              Manage your transactions, bills, and financial goals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${balance.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${totalIncome.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${totalExpenses.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-end">
              <Dialog
                open={isTransactionDialogOpen}
                onOpenChange={setIsTransactionDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddTransaction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={transactionForm.type}
                        onValueChange={(value: any) =>
                          setTransactionForm({ ...transactionForm, type: value })
                        }
                      >
                        <SelectTrigger id="type" className="border-thin">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={transactionForm.amount}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, amount: e.target.value })
                        }
                        required
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        placeholder="e.g., Food, Salary"
                        value={transactionForm.category}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, category: e.target.value })
                        }
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Optional description"
                        value={transactionForm.description}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, description: e.target.value })
                        }
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={transactionForm.date}
                        onChange={(e) =>
                          setTransactionForm({ ...transactionForm, date: e.target.value })
                        }
                        required
                        className="border-thin"
                      />
                    </div>

                    {members.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="member">Family Member</Label>
                        <Select
                          value={transactionForm.member_id}
                          onValueChange={(value) =>
                            setTransactionForm({ ...transactionForm, member_id: value })
                          }
                        >
                          <SelectTrigger id="member" className="border-thin">
                            <SelectValue placeholder="Select member (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {members.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button type="submit" className="w-full">
                      Add Transaction
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="border-thin shadow-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="p-4 hover:bg-muted/50 transition-smooth">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                transaction.type === 'income' ? 'bg-muted' : 'bg-muted'
                              }`}
                            >
                              {transaction.type === 'income' ? (
                                <TrendingUp className="w-5 h-5" />
                              ) : (
                                <TrendingDown className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.description || transaction.category || 'Transaction'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(transaction.date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold">
                            {transaction.type === 'income' ? '+' : '-'}$
                            {Number(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bills" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isBillDialogOpen} onOpenChange={setIsBillDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Bill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Bill</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddBill} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bill_name">Bill Name *</Label>
                      <Input
                        id="bill_name"
                        placeholder="e.g., Electricity"
                        value={billForm.name}
                        onChange={(e) => setBillForm({ ...billForm, name: e.target.value })}
                        required
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bill_amount">Amount *</Label>
                      <Input
                        id="bill_amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={billForm.amount}
                        onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                        required
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due_date">Due Date *</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={billForm.due_date}
                        onChange={(e) => setBillForm({ ...billForm, due_date: e.target.value })}
                        required
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bill_category">Category</Label>
                      <Input
                        id="bill_category"
                        placeholder="e.g., Utilities"
                        value={billForm.category}
                        onChange={(e) => setBillForm({ ...billForm, category: e.target.value })}
                        className="border-thin"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Add Bill
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="border-thin shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Upcoming Bills</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBills.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No upcoming bills</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingBills.map((bill) => (
                        <div
                          key={bill.id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Receipt className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{bill.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {format(new Date(bill.due_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold">${Number(bill.amount).toFixed(2)}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkBillPaid(bill)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-thin shadow-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Paid Bills</CardTitle>
                </CardHeader>
                <CardContent>
                  {paidBills.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">No paid bills</p>
                  ) : (
                    <div className="space-y-3">
                      {paidBills.slice(0, 5).map((bill) => (
                        <div
                          key={bill.id}
                          className="flex items-center justify-between p-3 border border-border rounded-lg opacity-60"
                        >
                          <div className="flex items-center gap-3">
                            <Receipt className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{bill.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Paid: {format(new Date(bill.due_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <span className="font-semibold">${Number(bill.amount).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Goal</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddGoal} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="goal_name">Goal Name *</Label>
                      <Input
                        id="goal_name"
                        placeholder="e.g., Emergency Fund"
                        value={goalForm.name}
                        onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                        required
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_amount">Target Amount *</Label>
                      <Input
                        id="target_amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={goalForm.target_amount}
                        onChange={(e) =>
                          setGoalForm({ ...goalForm, target_amount: e.target.value })
                        }
                        required
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="current_amount">Current Amount</Label>
                      <Input
                        id="current_amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={goalForm.current_amount}
                        onChange={(e) =>
                          setGoalForm({ ...goalForm, current_amount: e.target.value })
                        }
                        className="border-thin"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={goalForm.deadline}
                        onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                        className="border-thin"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Add Goal
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {goals.length === 0 ? (
                <Card className="border-thin shadow-card xl:col-span-2">
                  <CardContent className="p-12 text-center">
                    <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">No goals yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first financial goal to start tracking progress
                    </p>
                  </CardContent>
                </Card>
              ) : (
                goals.map((goal) => {
                  const progress =
                    (Number(goal.current_amount) / Number(goal.target_amount)) * 100;

                  return (
                    <Card key={goal.id} className="border-thin shadow-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-muted-foreground" />
                            <CardTitle className="text-base">{goal.name}</CardTitle>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-foreground h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Current</p>
                            <p className="font-semibold">
                              ${Number(goal.current_amount).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Target</p>
                            <p className="font-semibold">
                              ${Number(goal.target_amount).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {goal.deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
