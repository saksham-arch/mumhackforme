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
import { getGoals, createGoal, updateGoal } from '@/db/api';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Goal } from '@/types/types';

export default function GoalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    deadline: '',
  });

  const [updateAmount, setUpdateAmount] = useState('');

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getGoals(user.id);
      setGoals(data);
    } catch (error: any) {
      toast({
        title: 'Error loading goals',
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
      await createGoal({
        user_id: user.id,
        name: formData.name,
        target_amount: Number(formData.target_amount),
        current_amount: 0,
        deadline: formData.deadline || null,
      });

      toast({
        title: 'Goal created',
        description: 'Your goal has been added successfully',
      });

      setIsDialogOpen(false);
      setFormData({
        name: '',
        target_amount: '',
        deadline: '',
      });

      loadGoals();
    } catch (error: any) {
      toast({
        title: 'Error creating goal',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      const newAmount = Number(selectedGoal.current_amount) + Number(updateAmount);

      await updateGoal(selectedGoal.id, {
        current_amount: newAmount,
      });

      toast({
        title: 'Progress updated',
        description: 'Your goal progress has been updated',
      });

      setIsUpdateDialogOpen(false);
      setUpdateAmount('');
      setSelectedGoal(null);

      loadGoals();
    } catch (error: any) {
      toast({
        title: 'Error updating progress',
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
            <h1 className="text-3xl font-bold mb-2">Goals</h1>
            <p className="text-muted-foreground">Track your financial goals and progress</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-thin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_amount">Target Amount</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.target_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, target_amount: e.target.value })
                    }
                    required
                    className="border-thin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No goals yet. Create your first financial goal!
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress =
                    (Number(goal.current_amount) / Number(goal.target_amount)) * 100;

                  return (
                    <div
                      key={goal.id}
                      className="p-4 border border-border rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{goal.name}</h3>
                          {goal.deadline && (
                            <p className="text-sm text-muted-foreground">
                              Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-thin"
                          onClick={() => {
                            setSelectedGoal(goal);
                            setIsUpdateDialogOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            ${Number(goal.current_amount).toFixed(2)} / $
                            {Number(goal.target_amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-smooth"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-right">
                          {progress.toFixed(1)}% complete
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProgress} className="space-y-4">
              <div className="space-y-2">
                <Label>Current Goal</Label>
                <p className="text-sm text-muted-foreground">{selectedGoal?.name}</p>
                <p className="text-sm">
                  Current: ${Number(selectedGoal?.current_amount || 0).toFixed(2)} / $
                  {Number(selectedGoal?.target_amount || 0).toFixed(2)}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateAmount">Add Amount</Label>
                <Input
                  id="updateAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={updateAmount}
                  onChange={(e) => setUpdateAmount(e.target.value)}
                  required
                  className="border-thin"
                />
              </div>

              <Button type="submit" className="w-full">
                Update Progress
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
