import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Eye, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SecurityEvent {
  id: string;
  action: string;
  created_at: string;
  ip_address?: string | null;
  new_values?: any;
}

export const SecurityMonitor: React.FC = () => {
  const { user } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
      setIsLoading(false);
      return;
    }

    const fetchSecurityEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('id, action, created_at, ip_address, new_values')
          .ilike('action', 'security_%')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Failed to fetch security events:', error);
          return;
        }

        setSecurityEvents((data || []).map(item => ({
          ...item,
          ip_address: item.ip_address as string | null
        })));
      } catch (error) {
        console.error('Security monitor error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityEvents();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('security_events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs',
          filter: 'action=ilike.security_%',
        },
        (payload) => {
          setSecurityEvents(prev => [payload.new as SecurityEvent, ...prev.slice(0, 49)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading security events...</p>
        </CardContent>
      </Card>
    );
  }

  const getEventIcon = (action: string) => {
    if (action.includes('login') || action.includes('auth')) return <Lock className="h-4 w-4" />;
    if (action.includes('suspicious') || action.includes('violation')) return <AlertTriangle className="h-4 w-4" />;
    return <Eye className="h-4 w-4" />;
  };

  const getEventSeverity = (action: string): 'default' | 'secondary' | 'destructive' => {
    if (action.includes('failed') || action.includes('violation') || action.includes('suspicious')) {
      return 'destructive';
    }
    if (action.includes('locked') || action.includes('blocked')) {
      return 'secondary';
    }
    return 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Monitor
          {securityEvents.length > 0 && (
            <Badge variant="outline">{securityEvents.length} events</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {securityEvents.length === 0 ? (
          <p className="text-muted-foreground">No security events recorded</p>
        ) : (
          <div className="space-y-3">
            {securityEvents.slice(0, 10).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {getEventIcon(event.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={getEventSeverity(event.action)}>
                      {event.action.replace('security_', '').replace('_', ' ')}
                    </Badge>
                    {event.ip_address && (
                      <span className="text-sm text-muted-foreground">
                        IP: {event.ip_address}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(event.created_at).toLocaleString('nl-NL')}
                  </p>
                  {event.new_values?.details && (
                    <p className="text-sm mt-1">
                      {JSON.stringify(event.new_values.details)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};