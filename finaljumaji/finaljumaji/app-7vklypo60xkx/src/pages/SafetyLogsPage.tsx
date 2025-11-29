import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSafetyLogs } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { SafetyLog } from '@/types/types';
import { Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SafetyLogsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<SafetyLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLogs();
    }
  }, [user]);

  const loadLogs = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getSafetyLogs(user.id);
      setLogs(data);
    } catch (error: any) {
      toast({
        title: 'Error loading logs',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLogTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      high_risk: 'High Risk Interaction',
      fallback: 'Fallback Trigger',
      asr_failure: 'ASR Failure',
      inconsistency: 'Inconsistency Resolution',
    };
    return labels[type] || type;
  };

  const getLogTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      high_risk: 'text-destructive',
      fallback: 'text-muted-foreground',
      asr_failure: 'text-muted-foreground',
      inconsistency: 'text-muted-foreground',
    };
    return colors[type] || 'text-muted-foreground';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Safety Logs</h1>
          <p className="text-muted-foreground">
            Monitor system safety events and risk indicators
          </p>
        </div>

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">System Events</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <Shield className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No safety logs</h3>
                  <p className="text-sm text-muted-foreground">
                    All systems operating normally
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={cn(
                      'p-4 border rounded-lg space-y-2',
                      log.log_type === 'high_risk'
                        ? 'border-destructive/20 bg-destructive/5'
                        : 'border-border'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {log.log_type === 'high_risk' ? (
                        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                      ) : (
                        <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                      )}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-xs font-medium uppercase tracking-wide',
                              getLogTypeColor(log.log_type)
                            )}
                          >
                            {getLogTypeLabel(log.log_type)}
                          </span>
                          {log.risk_score !== null && (
                            <span className="text-xs text-muted-foreground">
                              • Risk Score: {log.risk_score}
                            </span>
                          )}
                        </div>
                        <p className="text-sm">{log.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.created_at), 'MMM d, yyyy • h:mm a')}
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
