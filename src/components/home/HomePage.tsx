import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedHome } from './AuthenticatedHome';
import { PublicHome } from './PublicHome';
import { PageLoadingSpinner } from '@/components/loading/PageLoadingSpinner';

export function HomePage() {
  const { user, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return <PageLoadingSpinner />;
  }
  
  return user ? <AuthenticatedHome /> : <PublicHome />;
}