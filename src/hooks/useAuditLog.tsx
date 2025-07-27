import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AuditLogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = useCallback(async (entry: AuditLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: entry.action,
          table_name: entry.table_name,
          record_id: entry.record_id,
          old_values: entry.old_values,
          new_values: entry.new_values,
          ip_address: entry.ip_address || '127.0.0.1', // In production, get from headers
          user_agent: entry.user_agent || navigator.userAgent,
        });

      if (error) {
        console.error('Failed to log audit entry:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }, [user]);

  const logUserAction = useCallback((action: string, details?: Record<string, any>) => {
    logAction({
      action,
      new_values: details,
    });
  }, [logAction]);

  const logDataChange = useCallback((
    action: string,
    tableName: string,
    recordId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ) => {
    logAction({
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues,
    });
  }, [logAction]);

  const logSecurityEvent = useCallback((event: string, details?: Record<string, any>) => {
    logAction({
      action: `security_${event}`,
      new_values: {
        event,
        details,
        timestamp: new Date().toISOString(),
      },
    });
  }, [logAction]);

  return {
    logAction,
    logUserAction,
    logDataChange,
    logSecurityEvent,
  };
};