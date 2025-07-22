
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('wietforum_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          ...userData,
          joinedAt: new Date(userData.joinedAt),
          lastSeen: new Date(userData.lastSeen),
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('wietforum_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be an API call
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email,
        reputation: 150,
        badges: ['Newcomer'],
        isVerified: false,
        joinedAt: new Date('2024-01-15'),
        lastSeen: new Date(),
        isOnline: true,
        role: 'user',
      };
      
      setUser(mockUser);
      localStorage.setItem('wietforum_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock registration - check age verification
    const birthDate = new Date(userData.birthDate);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    
    if (age < 18) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      reputation: 0,
      badges: [],
      isVerified: false,
      joinedAt: new Date(),
      lastSeen: new Date(),
      isOnline: true,
      role: 'user',
    };
    
    setUser(newUser);
    localStorage.setItem('wietforum_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wietforum_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('wietforum_user', JSON.stringify(updatedUser));
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
