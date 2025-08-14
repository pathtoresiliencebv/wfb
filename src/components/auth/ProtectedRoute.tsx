
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [timedOut, setTimedOut] = React.useState(false);
  
  React.useEffect(() => {
    console.log('🛡️ [ProtectedRoute] isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'requireAuth:', requireAuth);
    const t = setTimeout(() => {
      console.log('⏰ [ProtectedRoute] Timeout triggered');
      setTimedOut(true);
    }, 3000); // Reduced from 10s to 3s
    return () => clearTimeout(t);
  }, [isLoading, isAuthenticated, requireAuth]);

  if (isLoading && !timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
