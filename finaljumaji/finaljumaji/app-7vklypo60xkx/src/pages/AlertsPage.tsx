import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAlerts, markAlertAsRead, deleteAlert } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Alert } from '@/types/types';
import { AlertTriangle, Info, AlertCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AlertsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getAlerts(user.id);
      setAlerts(data);
    } catch (error: any) {
      toast({
        title: 'Error loading alerts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (alert: Alert) => {
    try {
      await markAlertAsRead(alert.id);
      loadAlerts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (alert: Alert) => {
    try {
      await deleteAlert(alert.id);
      toast({
        title: 'Alert deleted',
        description: 'The alert has been removed',
      });
      loadAlerts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const unreadAlerts = alerts.filter((a) => !a.is_read);
  const readAlerts = alerts.filter((a) => a.is_read);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Stay informed about your financial health
          </p>
        </div>

        {unreadAlerts.length > 0 && (
          <Card className="border-thin shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Unread Alerts ({unreadAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {unreadAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 border rounded-lg space-y-2',
                    alert.severity === 'critical'
                      ? 'border-destructive/20 bg-destructive/5'
                      : 'border-border bg-accent/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(alert.severity)}
                    <div className="flex-1 space-y-1">
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alert.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(alert)}
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(alert)}
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="border-thin shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {readAlerts.length > 0 ? 'Read Alerts' : 'All Alerts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                  <Info className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">No alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! We'll notify you of any important updates.
                  </p>
                </div>
              </div>
            ) : readAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No read alerts
              </div>
            ) : (
              <div className="space-y-2">
                {readAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border border-border rounded-lg space-y-2 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(alert.severity)}
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(alert.created_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(alert)}
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </Button>
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
