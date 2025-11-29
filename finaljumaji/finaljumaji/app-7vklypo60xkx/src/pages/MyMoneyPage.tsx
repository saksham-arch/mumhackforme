import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import { useCurrency } from '@/hooks/use-currency';
import { convert, formatCurrency } from '@/lib/currency';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { getTransactions, createTransaction, getBalance } from '@/db/api';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Transaction } from '@/types/types';

export default function MyMoneyPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const { currency, rate } = useCurrency();

  const loadData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [txns, bal] = await Promise.all([
        getTransactions(user.id, 100),
        getBalance(user.id),
      ]);
      setTransactions(txns);
      setBalance(bal);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createTransaction({
        user_id: user.id,
        member_id: null,
        type: formData.type,
        amount: Number(formData.amount),
        category: formData.category || null,
        description: formData.description || null,
        date: formData.date,
      });

      toast({
        title: 'Transaction added',
        description: 'Your transaction has been recorded',
      });

      setIsDialogOpen(false);
      setFormData({
        type: 'income',
        amount: '',
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });

      loadData();
    } catch (error: any) {
      toast({
        title: 'Error adding transaction',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Money</h1>
            <p className="text-muted-foreground">Track your income and expenses</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'income' | 'expense') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="border-thin">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="border-thin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Food, Salary, Shopping"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border-thin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Optional description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="border-thin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="border-thin"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">
                {currency === 'USD'
                  ? formatCurrency(balance, 'USD')
                  : formatCurrency(convert(balance, rate), 'INR')}
              </span>
              {balance >= 0 ? (
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <TrendingDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions yet. Add your first transaction!
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {txn.type}
                        </span>
                        {txn.category && (
                          <span className="text-xs text-muted-foreground">
                            • {txn.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{txn.description || 'Transaction'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(txn.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${
                          txn.type === 'income' ? 'text-foreground' : 'text-foreground'
                        }`}
                      >
                        {txn.type === 'income' ? '+' : '-'}
                        {currency === 'USD'
                          ? formatCurrency(Number(txn.amount), 'USD')
                          : formatCurrency(convert(Number(txn.amount), rate), 'INR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
