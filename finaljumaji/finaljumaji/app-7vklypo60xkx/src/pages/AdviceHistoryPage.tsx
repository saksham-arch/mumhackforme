import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdviceHistory } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { AdviceHistory } from '@/types/types';
import { Lightbulb } from 'lucide-react';

export default function AdviceHistoryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [advice, setAdvice] = useState<AdviceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAdvice();
    }
  }, [user]);

  const loadAdvice = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getAdviceHistory(user.id);
      setAdvice(data);
    } catch (error: any) {
      toast({
        title: 'Error loading advice',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupedAdvice = {
    savings: advice.filter((a) => a.category === 'savings'),
    emergency: advice.filter((a) => a.category === 'emergency'),
    planning: advice.filter((a) => a.category === 'planning'),
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Advice History</h1>
          <p className="text-muted-foreground">
            Review your AI-powered financial advice and recommendations
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : advice.length === 0 ? (
          <Card className="border-thin shadow-card">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No advice yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start asking questions in the AI Assistant to get personalized advice
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAdvice).map(([category, items]) => {
              if (items.length === 0) return null;

              return (
                <Card key={category} className="border-thin shadow-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium capitalize">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border border-border rounded-lg space-y-2"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <p className="text-sm font-medium">{item.question}</p>
                            <p className="text-sm text-muted-foreground">{item.answer}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(item.created_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
