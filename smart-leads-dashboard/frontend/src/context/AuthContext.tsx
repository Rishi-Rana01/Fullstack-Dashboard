import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginApi, registerApi, getMeApi } from '../api/auth.api';
import {
  AuthContextType,
  AuthUser,
  LoginFormData,
  RegisterFormData,
} from '../types/auth.types';

// ── Auth Context ────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // True on mount while we validate

  // ── Persist helpers ─────────────────────────────────────────────────────
  const persistAuth = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // ── Restore session on mount ────────────────────────────────────────────
  // Validate the stored token against the /me endpoint on every page load
  // to handle cases where the token has expired or been revoked.
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify token is still valid by hitting the /me endpoint
        const currentUser = await getMeApi();
        setToken(storedToken);
        setUser(currentUser);
      } catch {
        // Token is invalid or expired — clear stale auth state
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, [clearAuth]);

  // ── Login ───────────────────────────────────────────────────────────────
  const login = useCallback(
    async (data: LoginFormData): Promise<void> => {
      const result = await loginApi(data);
      persistAuth(result.token, result.user);
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate('/dashboard');
    },
    [persistAuth, navigate]
  );

  // ── Register ────────────────────────────────────────────────────────────
  const register = useCallback(
    async (data: RegisterFormData): Promise<void> => {
      const result = await registerApi(data);
      persistAuth(result.token, result.user);
      toast.success(`Account created! Welcome, ${result.user.name}!`);
      navigate('/dashboard');
    },
    [persistAuth, navigate]
  );

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback((): void => {
    clearAuth();
    toast.success('Logged out successfully.');
    navigate('/login');
  }, [clearAuth, navigate]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * useAuth — consumes the AuthContext.
 * Throws if used outside of <AuthProvider>.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
