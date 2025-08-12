import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  reputation: number;
  badges: string[];
  isVerified: boolean;
  joinedAt: Date;
  lastSeen: Date;
  isOnline: boolean;
  role: 'user' | 'moderator' | 'expert' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailVerified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  resetPassword: (email: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  birthDate: string;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Debug: detect potential duplicate React copies
  // eslint-disable-next-line no-console
  console.log('[Debug] React.version:', (React as any).version);
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const { toast } = useToast();

  // Helper function to fetch user profile from database
  const fetchUserProfile = React.useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      console.log('🔍 [AuthContext] Fetching user profile for:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error('❌ [AuthContext] Error fetching user profile:', error);
        return null;
      }

      if (!profile) {
        console.log('⚠️ [AuthContext] No profile found for user:', supabaseUser.id);
        return null;
      }

      console.log('✅ [AuthContext] Profile found:', profile);

      const badges: string[] = [];

      return {
        id: profile.user_id,
        username: profile.username,
        email: supabaseUser.email || '',
        avatar: profile.avatar_url,
        displayName: profile.display_name,
        bio: profile.bio,
        reputation: profile.reputation,
        badges,
        isVerified: profile.is_verified,
        joinedAt: new Date(profile.created_at),
        lastSeen: new Date(profile.updated_at),
        isOnline: true,
        role: profile.role as 'user' | 'moderator' | 'expert' | 'admin',
      };
    } catch (error) {
      console.error('❌ [AuthContext] Error fetching user profile:', error);
      return null;
    }
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const getInitialSession = async () => {
      try {
        console.log('🚀 [AuthContext] Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error('❌ [AuthContext] Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('👤 [AuthContext] Session found, fetching profile...');
          const userProfile = await fetchUserProfile(session.user);
          if (isMounted) {
            setUser(userProfile);
            setEmailVerified(!!session.user.email_confirmed_at);
            console.log('✅ [AuthContext] User profile set:', userProfile?.role);
          }
        } else {
          console.log('ℹ️ [AuthContext] No session found');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Error getting initial session:', error);
      } finally {
        if (isMounted) {
          console.log('✅ [AuthContext] Initial session check complete');
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('🔄 [AuthContext] Auth state change:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          if (isMounted) {
            setUser(userProfile);
            setEmailVerified(!!session.user.email_confirmed_at);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setEmailVerified(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = React.useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        let errorMessage = 'Er is een fout opgetreden bij het inloggen.';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Ongeldig e-mailadres of wachtwoord.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Je e-mailadres is nog niet bevestigd. Controleer je inbox.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Te veel inlogpogingen. Probeer het later opnieuw.';
        }
        
        toast({
          title: 'Login mislukt',
          description: errorMessage,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        if (userProfile) {
          setUser(userProfile);
          toast({
            title: 'Welkom terug!',
            description: `Hallo ${userProfile.username}, je bent succesvol ingelogd.`,
          });
        }
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login mislukt',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
    return false;
  }, [fetchUserProfile, toast]);

  const register = React.useCallback(async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check age verification
      const birthDate = new Date(userData.birthDate);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        toast({
          title: 'Registratie mislukt',
          description: 'Je moet minimaal 18 jaar oud zijn om te registreren.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      const baseUrl = window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${baseUrl}/`,
          data: {
            username: userData.username,
            display_name: userData.username,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Er is een fout opgetreden tijdens de registratie.';
        
        if (error.message.includes('already registered')) {
          errorMessage = 'Dit e-mailadres is al in gebruik.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Het wachtwoord voldoet niet aan de eisen.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Ongeldig e-mailadres.';
        }
        
        toast({
          title: 'Registratie mislukt',
          description: errorMessage,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        toast({
          title: 'Account succesvol aangemaakt! 🎉',
          description: 'Check je inbox en klik op de bevestigingslink om je account te activeren.',
        });

        setIsLoading(false);
        return true;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registratie mislukt',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
    return false;
  }, [toast]);

  const logout = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: 'Uitgelogd',
        description: 'Je bent succesvol uitgelogd.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Fout bij uitloggen',
        description: 'Er is een fout opgetreden bij het uitloggen.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateUser = React.useCallback((userData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...userData });
  }, [user]);

  const resetPassword = React.useCallback(async (email: string): Promise<boolean> => {
    try {
      const baseUrl = window.location.origin;
        
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: 'Reset mislukt',
          description: 'Er is een fout opgetreden bij het resetten van je wachtwoord.',
          variant: 'destructive',
        });
        return false;
      }

      return true;
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Reset mislukt',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const resendVerificationEmail = React.useCallback(async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Geen gebruiker',
          description: 'Je moet ingelogd zijn om een verificatie-email te versturen.',
          variant: 'destructive',
        });
        return false;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) {
        console.error('Resend verification error:', error);
        toast({
          title: 'Versturen mislukt',
          description: 'Er is een fout opgetreden bij het versturen van de verificatie-email.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Verificatie-email verstuurd',
        description: 'Controleer je inbox voor de nieuwe verificatie-email.',
      });

      return true;
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast({
        title: 'Versturen mislukt',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  const value: AuthContextType = React.useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    emailVerified,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
    resendVerificationEmail,
    showOnboarding,
    setShowOnboarding,
  }), [
    user,
    isLoading,
    emailVerified,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
    resendVerificationEmail,
    showOnboarding,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}