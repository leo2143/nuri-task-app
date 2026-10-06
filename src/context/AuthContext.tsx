import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type { IAuthUser, IUserProfile } from "../interfaces";
import { offlineStorage } from "../utils/offlineStorage";
import { subscriptionService } from "../services/subscriptionService";
import { userService } from "../services/userService";
import { setSessionExpiredHandler } from "../config/axios";

export interface AuthState {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isPremium: boolean;
}

export interface AuthActions {
  login: (user: IAuthUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: IAuthUser) => void;
  refreshSubscription: () => Promise<void>;
}

export type AuthContextType = AuthState & AuthActions;

const USER_STORAGE_KEY = "user";

/**
 * Perfil de API → usuario de sesión (sin JWT).
 */
function toAuthUser(profile: IUserProfile): IAuthUser {
  return {
    _id: profile._id,
    name: profile.name,
    email: profile.email,
    isAdmin: !!profile.isAdmin,
    googleId: profile.googleId,
    profileImageUrl: profile.profileImageUrl ?? undefined,
    subscription: profile.subscription
      ? { isActive: profile.subscription.isActive }
      : undefined,
    onboardingCompleted: profile.onboardingCompleted,
    emailVerified: profile.emailVerified,
    hasPassword: profile.hasPassword,
  };
}

function persistUser(userData: IAuthUser) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
}

function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthActionsContext = createContext<AuthActions | undefined>(undefined);

export { AuthStateContext, AuthActionsContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      clearStoredUser();
      setUser(null);
      setIsAuthenticated(false);
    });

    let cancelled = false;

    const hydrateSession = async () => {
      try {
        const profile = await userService.getSessionProfile();
        if (cancelled) return;

        if (profile) {
          const authUser = toAuthUser(profile);
          persistUser(authUser);
          setUser(authUser);
          setIsAuthenticated(true);
        } else {
          clearStoredUser();
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      cancelled = true;
      setSessionExpiredHandler(() => {});
    };
  }, []);

  const login = useCallback((userData: IAuthUser) => {
    persistUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.error("Error al cerrar sesión en el API:", error);
    }
    clearStoredUser();
    offlineStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback((userData: IAuthUser) => {
    persistUser(userData);
    setUser(userData);
  }, []);

  const refreshSubscription = useCallback(async () => {
    try {
      const data = await subscriptionService.getStatus();
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        const updated: IAuthUser = {
          ...prevUser,
          subscription: { isActive: data.subscription.isActive },
        };
        persistUser(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error al refrescar suscripción:", error);
    }
  }, []);

  const isPremium = !!user?.isAdmin || !!user?.subscription?.isActive;

  const stateValue = useMemo<AuthState>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isPremium,
    }),
    [user, isAuthenticated, isLoading, isPremium],
  );

  const actionsValue = useMemo<AuthActions>(
    () => ({
      login,
      logout,
      updateUser,
      refreshSubscription,
    }),
    [login, logout, updateUser, refreshSubscription],
  );

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
}
