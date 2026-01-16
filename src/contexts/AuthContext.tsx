import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    const stored = localStorage.getItem('mindease_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    // Mock login - in production this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: 'user_' + Date.now(),
      name: email.split('@')[0],
      email,
      isGuest: false,
    };
    
    setUser(mockUser);
    localStorage.setItem('mindease_user', JSON.stringify(mockUser));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // Mock signup - in production this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser: User = {
      id: 'user_' + Date.now(),
      name,
      email,
      isGuest: false,
    };
    
    setUser(mockUser);
    localStorage.setItem('mindease_user', JSON.stringify(mockUser));
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      name: 'Guest',
      email: '',
      isGuest: true,
    };
    
    setUser(guestUser);
    // Don't persist guest users to localStorage
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('mindease_user');
    localStorage.removeItem('mindease_mood_logs');
    localStorage.removeItem('mindease_chat_history');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: user?.isGuest ?? false,
        login,
        signup,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
