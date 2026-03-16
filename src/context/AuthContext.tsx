import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { IAuthUser } from "../interfaces";
import { offlineStorage } from "../utils/offlineStorage";
import { subscriptionService } from "../services/subscriptionService";

export interface AuthContextType {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;

  login: (user: IAuthUser, token: string) => void;
  logout: () => void;
  updateUser: (user: IAuthUser) => void;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al cargar usuario desde localStorage:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: IAuthUser, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    offlineStorage.clear();

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: IAuthUser) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const refreshSubscription = useCallback(async () => {
    if (!user) return;
    try {
      const data = await subscriptionService.getStatus();
      const updated: IAuthUser = {
        ...user,
        subscription: { isActive: data.subscription.isActive },
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    } catch (error) {
      console.error("Error al refrescar suscripción:", error);
    }
  }, [user]);

  const isPremium = !!user?.isAdmin || !!user?.subscription?.isActive;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isPremium,
        login,
        logout,
        updateUser,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
