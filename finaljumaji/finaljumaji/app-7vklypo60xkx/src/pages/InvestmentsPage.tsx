import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { getInvestments, createInvestment, updateInvestment, deleteInvestment, getFamilyMembers } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Investment, FamilyMember } from '@/types/types';
import { Plus, TrendingUp, Edit, Trash2, DollarSign, Percent } from 'lucide-react';

export default function InvestmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    type: 'stocks' as 'stocks' | 'bonds' | 'real_estate' | 'crypto' | 'mutual_funds' | 'other',
    member_id: '',
    initial_amount: '',
    current_value: '',
    purchase_date: '',
    expected_return_rate: '',
    notes: '',
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
      const [investmentsData, membersData] = await Promise.all([
        getInvestments(user.id),
        getFamilyMembers(user.id),
      ]);
      setInvestments(investmentsData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingInvestment) {
        await updateInvestment(editingInvestment.id, {
          name: formData.name,
          type: formData.type,
          member_id: formData.member_id || null,
          initial_amount: Number(formData.initial_amount),
          current_value: Number(formData.current_value),
          purchase_date: formData.purchase_date,
          expected_return_rate: Number(formData.expected_return_rate) || 0,
          notes: formData.notes || null,
        });

        toast({
          title: 'Investment updated',
          description: 'Investment has been updated successfully',
        });
      } else {
        await createInvestment({
          user_id: user.id,
          name: formData.name,
          type: formData.type,
          member_id: formData.member_id || null,
          initial_amount: Number(formData.initial_amount),
          current_value: Number(formData.current_value),
          purchase_date: formData.purchase_date,
          expected_return_rate: Number(formData.expected_return_rate) || 0,
          notes: formData.notes || null,
        });

        toast({
          title: 'Investment added',
          description: 'Investment has been added successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingInvestment(null);
      setFormData({
        name: '',
        type: 'stocks',
        member_id: '',
        initial_amount: '',
        current_value: '',
        purchase_date: '',
        expected_return_rate: '',
        notes: '',
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

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setFormData({
      name: investment.name,
      type: investment.type,
      member_id: investment.member_id || '',
      initial_amount: String(investment.initial_amount),
      current_value: String(investment.current_value),
      purchase_date: investment.purchase_date,
      expected_return_rate: String(investment.expected_return_rate),
      notes: investment.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (investment: Investment) => {
    if (!confirm(`Are you sure you want to delete ${investment.name}?`)) return;

    try {
      await deleteInvestment(investment.id);
      toast({
        title: 'Investment deleted',
        description: 'Investment has been removed',
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

  const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.initial_amount), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investments</h1>
            <p className="text-muted-foreground">Track your investment portfolio and returns</p>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingInvestment(null);
                setFormData({
                  name: '',
                  type: 'stocks',
                  member_id: '',
                  initial_amount: '',
                  current_value: '',
                  purchase_date: '',
                  expected_return_rate: '',
                  notes: '',
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingInvestment ? 'Edit Investment' : 'Add Investment'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Investment Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Apple Stock, Bitcoin"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger id="type" className="border-thin">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stocks">Stocks</SelectItem>
                        <SelectItem value="bonds">Bonds</SelectItem>
                        <SelectItem value="real_estate">Real Estate</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member_id">Owner</Label>
                    <Select
                      value={formData.member_id}
                      onValueChange={(value) => setFormData({ ...formData, member_id: value })}
                    >
                      <SelectTrigger id="member_id" className="border-thin">
                        <SelectValue placeholder="Select owner (optional)" />
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

                  <div className="space-y-2">
                    <Label htmlFor="purchase_date">Purchase Date *</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) =>
                        setFormData({ ...formData, purchase_date: e.target.value })
                      }
                      required
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initial_amount">Initial Amount *</Label>
                    <Input
                      id="initial_amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.initial_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, initial_amount: e.target.value })
                      }
                      required
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="current_value">Current Value *</Label>
                    <Input
                      id="current_value"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.current_value}
                      onChange={(e) =>
                        setFormData({ ...formData, current_value: e.target.value })
                      }
                      required
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2 xl:col-span-2">
                    <Label htmlFor="expected_return_rate">Expected Annual Return (%)</Label>
                    <Input
                      id="expected_return_rate"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 7.5"
                      value={formData.expected_return_rate}
                      onChange={(e) =>
                        setFormData({ ...formData, expected_return_rate: e.target.value })
                      }
                      className="border-thin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about this investment"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="border-thin"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingInvestment ? 'Update Investment' : 'Add Investment'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${totalInvested.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${totalCurrentValue.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gain/Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span
                  className={`text-3xl font-bold ${
                    totalGainLoss >= 0 ? 'text-foreground' : 'text-foreground'
                  }`}
                >
                  {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Return %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Percent className="w-8 h-8 text-muted-foreground" />
                <span
                  className={`text-3xl font-bold ${
                    totalGainLossPercent >= 0 ? 'text-foreground' : 'text-foreground'
                  }`}
                >
                  {totalGainLossPercent >= 0 ? '+' : ''}
                  {totalGainLossPercent.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Investment Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : investments.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No investments yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your first investment to start tracking your portfolio
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((investment) => {
                  const gainLoss = Number(investment.current_value) - Number(investment.initial_amount);
                  const gainLossPercent =
                    Number(investment.initial_amount) > 0
                      ? (gainLoss / Number(investment.initial_amount)) * 100
                      : 0;

                  return (
                    <div
                      key={investment.id}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{investment.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {investment.type.replace('_', ' ')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(investment)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(investment)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Initial</p>
                          <p className="font-semibold">
                            ${Number(investment.initial_amount).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Current</p>
                          <p className="font-semibold">
                            ${Number(investment.current_value).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Gain/Loss</p>
                          <p
                            className={`font-semibold ${
                              gainLoss >= 0 ? 'text-foreground' : 'text-foreground'
                            }`}
                          >
                            {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLossPercent >= 0 ? '+' : ''}
                            {gainLossPercent.toFixed(2)}%)
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Purchase Date</p>
                          <p className="font-semibold">
                            {format(new Date(investment.purchase_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>

                      {investment.notes && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <p className="text-sm text-muted-foreground">{investment.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
