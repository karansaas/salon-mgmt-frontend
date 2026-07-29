import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getMe, loginRequest, logoutRequest } from './auth.api';
import type { User } from '../../types/auth';

type AuthContextValue = { user: User | null; isLoading: boolean; login(email: string, password: string): Promise<void>; logout(): Promise<void>; };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try { setUser(await getMe()); } catch { setUser(null); } finally { setIsLoading(false); }
    };
    void restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    setUser(response.user);
  };
  const logout = async () => {
    try { await logoutRequest(); } finally { setUser(null); }
  };
  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
