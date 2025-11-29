import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from 'miaoda-auth-react';
import { getProfile, updateProfile } from '@/db/api';
import MainLayout from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [languagePreference, setLanguagePreference] = useState('en');
  const [primaryIncomeType, setPrimaryIncomeType] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profile = await getProfile(user.id);
      if (profile) {
        setName(profile.name || '');
        setLanguagePreference(profile.language_preference || 'en');
        setPrimaryIncomeType(profile.primary_income_type || '');
      }
    } catch (error: any) {
      toast({
        title: 'Error loading profile',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      await updateProfile(user.id, {
        name,
        language_preference: languagePreference,
        primary_income_type: primaryIncomeType,
      });

      toast({
        title: 'Profile updated',
        description: 'Your settings have been saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Update your account preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-thin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language Preference</Label>
              <Select value={languagePreference} onValueChange={setLanguagePreference}>
                <SelectTrigger id="language" className="border-thin">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incomeType">Primary Income Type</Label>
              <Select value={primaryIncomeType} onValueChange={setPrimaryIncomeType}>
                <SelectTrigger id="incomeType" className="border-thin">
                  <SelectValue placeholder="Select income type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
