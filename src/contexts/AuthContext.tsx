
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
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
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  birthDate: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Helper function to fetch user profile from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_badges(
            badges(name)
          )
        `)
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (!profile) return null;

      const badges = profile.user_badges?.map((ub: any) => ub.badges.name) || [];

      return {
        id: profile.user_id,
        username: profile.username,
        email: supabaseUser.email || '',
        avatar: profile.avatar_url,
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
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: 'Login mislukt',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
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
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check age verification
      const birthDate = new Date(userData.birthDate);
      const today = new Date();
      
      // Calculate age more accurately
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

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        console.error('Registration error:', error);
        toast({
          title: 'Registratie mislukt',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            username: userData.username,
            display_name: userData.username,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: 'Registratie mislukt',
            description: 'Er is een fout opgetreden bij het aanmaken van je profiel.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return false;
        }

        // Assign Newcomer badge
        const { data: newcomerBadge } = await supabase
          .from('badges')
          .select('id')
          .eq('name', 'Newcomer')
          .single();

        if (newcomerBadge) {
          await supabase
            .from('user_badges')
            .insert({
              user_id: data.user.id,
              badge_id: newcomerBadge.id,
            });
        }

        toast({
          title: 'Registratie succesvol',
          description: 'Je account is aangemaakt. Je kunt nu inloggen.',
        });

        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registratie mislukt',
        description: 'Er is een onverwachte fout opgetreden.',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: userData.username,
          bio: userData.bio,
          avatar_url: userData.avatar,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Update user error:', error);
        return;
      }

      setUser({ ...user, ...userData });
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
