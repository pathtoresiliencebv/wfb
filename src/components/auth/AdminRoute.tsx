import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Toegang controleren...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = requireRole === 'moderator' 
    ? (user.role === 'admin' || user.role === 'moderator')
    : user.role === 'admin';

  if (!hasRequiredRole) {
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