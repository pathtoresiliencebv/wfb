import { useAuth } from '@/contexts/AuthContext';
import { AuthenticatedHome } from './AuthenticatedHome';
import { PublicHome } from './PublicHome';

export function HomePage() {
  const { user } = useAuth();
  
  return user ? <AuthenticatedHome /> : <PublicHome />;
}