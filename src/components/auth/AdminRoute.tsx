import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'moderator';
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requireRole = 'moderator',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [verifying, setVerifying] = React.useState(true);
  const [hasAccess, setHasAccess] = React.useState(false);
  const [showTimeout, setShowTimeout] = React.useState(false);

  React.useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!isAuthenticated || !user) {
        setVerifying(false);
        return;
      }

      try {
        console.log('🔐 [AdminRoute] Verifying admin access server-side...');
        
        // Server-side verification using edge function
        const { data, error } = await supabase.functions.invoke('verify-admin-role');
        
        if (error) {
          console.error('❌ [AdminRoute] Verification error:', error);
          setHasAccess(false);
        } else {
          console.log('✅ [AdminRoute] Verification result:', data);
          setHasAccess(data?.isAdmin || false);
        }
      } catch (error) {
        console.error('❌ [AdminRoute] Verification failed:', error);
        setHasAccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyAdminAccess();
  }, [isAuthenticated, user]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading || verifying) {
        console.warn('⚠️ [AdminRoute] Loading timeout reached');
        setShowTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading, verifying]);

  if (isLoading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {showTimeout ? 'Verbinding controleren...' : 'Toegang controleren...'}
          </p>
          {showTimeout && (
            <p className="text-sm text-muted-foreground mt-2">
              Dit duurt langer dan verwacht. Probeer de pagina te vernieuwen.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!user || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Toegang Geweigerd</h2>
          <p className="text-muted-foreground">Je hebt geen toestemming om deze pagina te bekijken.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};