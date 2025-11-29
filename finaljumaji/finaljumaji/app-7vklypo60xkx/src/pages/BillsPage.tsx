import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
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
import { getBills, createBill, updateBill } from '@/db/api';
import { Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Bill } from '@/types/types';

export default function BillsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    category: '',
  });

  useEffect(() => {
    if (user) {
      loadBills();
    }
  }, [user]);

  const loadBills = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getBills(user.id);
      setBills(data);
    } catch (error: any) {
      toast({
        title: 'Error loading bills',
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
      await createBill({
        user_id: user.id,
        name: formData.name,
        amount: Number(formData.amount),
        due_date: formData.due_date,
        status: 'upcoming',
        category: formData.category || null,
      });

      toast({
        title: 'Bill added',
        description: 'Your bill has been added successfully',
      });

      setIsDialogOpen(false);
      setFormData({
        name: '',
        amount: '',
        due_date: format(new Date(), 'yyyy-MM-dd'),
        category: '',
      });

      loadBills();
    } catch (error: any) {
      toast({
        title: 'Error adding bill',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsPaid = async (bill: Bill) => {
    try {
      await updateBill(bill.id, { status: 'paid' });

      toast({
        title: 'Bill marked as paid',
        description: `${bill.name} has been marked as paid`,
      });

      loadBills();
    } catch (error: any) {
      toast({
        title: 'Error updating bill',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const upcomingBills = bills.filter((b) => b.status === 'upcoming');
  const paidBills = bills.filter((b) => b.status === 'paid');

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bills</h1>
            <p className="text-muted-foreground">Manage your upcoming and paid bills</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bill Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Electricity, Internet"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-thin"
                  />
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
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    required
                    className="border-thin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Utilities, Subscriptions"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Upcoming Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : upcomingBills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming bills. Add your first bill!
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{bill.name}</span>
                        {bill.category && (
                          <span className="text-xs text-muted-foreground">
                            • {bill.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Due: {format(new Date(bill.due_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-semibold">${Number(bill.amount).toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-thin"
                        onClick={() => handleMarkAsPaid(bill)}
                      >
                        <Check className="w-4 h-4" />
                        Mark Paid
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
              <div className="text-center py-8 text-muted-foreground">No paid bills yet</div>
            ) : (
              <div className="space-y-2">
                {paidBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-muted-foreground">{bill.name}</span>
                        {bill.category && (
                          <span className="text-xs text-muted-foreground">
                            • {bill.category}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Paid: {format(new Date(bill.due_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      ${Number(bill.amount).toFixed(2)}
                    </p>
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
