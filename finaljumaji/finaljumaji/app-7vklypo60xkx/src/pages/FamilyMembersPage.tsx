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
import { getFamilyMembers, createFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { FamilyMember } from '@/types/types';
import { Plus, Users, Edit, Trash2, DollarSign } from 'lucide-react';

export default function FamilyMembersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    relationship: 'self' as 'self' | 'spouse' | 'child' | 'parent' | 'other',
    email: '',
    phone: '',
    date_of_birth: '',
    occupation: '',
    monthly_income: '',
  });

  useEffect(() => {
    if (user) {
      loadMembers();
    }
  }, [user]);

  const loadMembers = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getFamilyMembers(user.id);
      setMembers(data);
    } catch (error: any) {
      toast({
        title: 'Error loading members',
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
      if (editingMember) {
        await updateFamilyMember(editingMember.id, {
          name: formData.name,
          relationship: formData.relationship,
          email: formData.email || null,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          occupation: formData.occupation || null,
          monthly_income: Number(formData.monthly_income) || 0,
        });

        toast({
          title: 'Member updated',
          description: 'Family member has been updated successfully',
        });
      } else {
        await createFamilyMember({
          user_id: user.id,
          name: formData.name,
          relationship: formData.relationship,
          email: formData.email || null,
          phone: formData.phone || null,
          date_of_birth: formData.date_of_birth || null,
          occupation: formData.occupation || null,
          monthly_income: Number(formData.monthly_income) || 0,
          is_active: true,
          avatar_url: null,
        });

        toast({
          title: 'Member added',
          description: 'Family member has been added successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingMember(null);
      setFormData({
        name: '',
        relationship: 'self',
        email: '',
        phone: '',
        date_of_birth: '',
        occupation: '',
        monthly_income: '',
      });

      loadMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      email: member.email || '',
      phone: member.phone || '',
      date_of_birth: member.date_of_birth || '',
      occupation: member.occupation || '',
      monthly_income: String(member.monthly_income),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (member: FamilyMember) => {
    if (!confirm(`Are you sure you want to remove ${member.name}?`)) return;

    try {
      await deleteFamilyMember(member.id);
      toast({
        title: 'Member removed',
        description: 'Family member has been removed',
      });
      loadMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const totalFamilyIncome = members
    .filter((m) => m.is_active)
    .reduce((sum, m) => sum + Number(m.monthly_income), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Family Members</h1>
            <p className="text-muted-foreground">
              Manage your family members and track their income
            </p>
          </div>

          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setEditingMember(null);
                setFormData({
                  name: '',
                  relationship: 'self',
                  email: '',
                  phone: '',
                  date_of_birth: '',
                  occupation: '',
                  monthly_income: '',
                });
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit Member' : 'Add Family Member'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, relationship: value })
                      }
                    >
                      <SelectTrigger id="relationship" className="border-thin">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) =>
                        setFormData({ ...formData, date_of_birth: e.target.value })
                      }
                      className="border-thin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      placeholder="Job title"
                      value={formData.occupation}
                      onChange={(e) =>
                        setFormData({ ...formData, occupation: e.target.value })
                      }
                      className="border-thin"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Monthly Income</Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.monthly_income}
                    onChange={(e) =>
                      setFormData({ ...formData, monthly_income: e.target.value })
                    }
                    className="border-thin"
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">{members.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-thin shadow-card xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Family Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-muted-foreground" />
                <span className="text-3xl font-bold">${totalFamilyIncome.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : members.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No family members yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your first family member to start tracking income
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{member.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {member.relationship}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(member)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {member.occupation && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Occupation:</span> {member.occupation}
                        </p>
                      )}
                      {member.email && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Email:</span> {member.email}
                        </p>
                      )}
                      {member.phone && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Phone:</span> {member.phone}
                        </p>
                      )}
                      {member.date_of_birth && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">DOB:</span>{' '}
                          {format(new Date(member.date_of_birth), 'MMM d, yyyy')}
                        </p>
                      )}
                      <div className="pt-2 border-t border-border">
                        <p className="font-semibold text-lg">
                          ${Number(member.monthly_income).toFixed(2)}
                          <span className="text-sm font-normal text-muted-foreground">
                            {' '}
                            / month
                          </span>
                        </p>
                      </div>
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
