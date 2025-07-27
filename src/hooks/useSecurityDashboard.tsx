import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityScore {
  id: string;
  score: number;
  factors: any;
  recommendations: any;
  created_at: string;
}

interface SecurityDashboard {
  currentScore: SecurityScore | null;
  scoreHistory: SecurityScore[];
  recentEvents: any[];
  deviceCount: number;
  sessionCount: number;
  has2FA: boolean;
}

export const useSecurityDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<SecurityDashboard>({
    currentScore: null,
    scoreHistory: [],
    recentEvents: [],
    deviceCount: 0,
    sessionCount: 0,
    has2FA: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch security dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch all dashboard data in parallel
      const [
        securityScores,
        securityEvents,
        deviceFingerprints,
        userSessions,
        twoFAStatus,
      ] = await Promise.all([
        supabase
          .from('user_security_scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('user_security_events')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('user_device_fingerprints')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', user.id)
          .gt('expires_at', new Date().toISOString()),
        supabase
          .from('user_2fa')
          .select('is_enabled')
          .eq('user_id', user.id)
          .single(),
      ]);

      setDashboard({
        currentScore: securityScores.data?.[0] || null,
        scoreHistory: securityScores.data || [],
        recentEvents: securityEvents.data || [],
        deviceCount: deviceFingerprints.data?.length || 0,
        sessionCount: userSessions.data?.length || 0,
        has2FA: twoFAStatus.data?.is_enabled || false,
      });
    } catch (error) {
      console.error('Error fetching security dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update security score
  const updateSecurityScore = useCallback(async () => {
    if (!user) return;

    try {
      // Trigger security score update
      await supabase.rpc('update_user_security_score', {
        target_user_id: user.id,
      });

      // Refresh dashboard data
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating security score:', error);
    }
  }, [user, fetchDashboardData]);

  // Calculate security level based on score
  const getSecurityLevel = useCallback((score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 50) return { level: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score >= 30) return { level: 'Poor', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100' };
  }, []);

  // Get security recommendations
  const getSecurityRecommendations = useCallback(() => {
    const recommendations = [];

    if (!dashboard.has2FA) {
      recommendations.push({
        type: 'enable_2fa',
        message: 'Enable two-factor authentication for stronger security',
        priority: 'high' as const,
        action: 'Enable 2FA',
        icon: 'Shield',
      });
    }

    if (dashboard.sessionCount > 5) {
      recommendations.push({
        type: 'manage_sessions',
        message: 'You have many active sessions. Consider terminating unused ones.',
        priority: 'medium' as const,
        action: 'Manage Sessions',
        icon: 'Smartphone',
      });
    }

    if (dashboard.deviceCount > 3) {
      recommendations.push({
        type: 'review_devices',
        message: 'Multiple devices detected. Review and remove unknown devices.',
        priority: 'medium' as const,
        action: 'Review Devices',
        icon: 'Monitor',
      });
    }

    // Check for recent high-risk events
    const recentHighRiskEvents = dashboard.recentEvents.filter(
      event => event.risk_level === 'high' || event.risk_level === 'critical'
    );

    if (recentHighRiskEvents.length > 0) {
      recommendations.push({
        type: 'review_security',
        message: 'Recent suspicious activities detected. Review your security events.',
        priority: 'high' as const,
        action: 'Review Events',
        icon: 'AlertTriangle',
      });
    }

    return recommendations;
  }, [dashboard]);

  // Initialize dashboard
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  return {
    dashboard,
    isLoading,
    fetchDashboardData,
    updateSecurityScore,
    getSecurityLevel,
    getSecurityRecommendations,
  };
};