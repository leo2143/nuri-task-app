import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import type { ReactNode } from "react";
import type { IAuthUser, IUserProfile } from "../interfaces";
import { offlineStorage } from "../utils/offlineStorage";
import { subscriptionService } from "../services/subscriptionService";
import { userService } from "../services/userService";
import { setSessionExpiredHandler } from "../config/axios";
import { canonicalTimeZone, getDeviceTimeZone } from "../utils/timezone";

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

// Espera tras volver a la pestaña antes de comparar zonas, para no disparar un sync por cada cambio rápido de foco
const TIMEZONE_SYNC_DEBOUNCE_MS = 1500;

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
    timezone: profile.timezone ?? undefined,
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
  const userRef = useRef<IAuthUser | null>(null);
  // Último par usuario|zona del dispositivo que se intentó sincronizar: evita reintentos en bucle (solo en memoria)
  const lastTimezoneAttemptRef = useRef<string | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

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
    lastTimezoneAttemptRef.current = null;
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

  // Sincroniza la zona del dispositivo con la del servidor. Compara las claves canónicas de ambas con el mismo Intl
  // del navegador, así dos grafías de una misma zona (alias) nunca disparan un sync. Un valor del servidor que
  // Intl no puede resolver cuenta como "distinto".
  const syncTimezone = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    const deviceTimeZone = getDeviceTimeZone();
    const deviceKey = canonicalTimeZone(deviceTimeZone);
    if (!deviceTimeZone || !deviceKey) return;
    if (deviceKey === canonicalTimeZone(currentUser.timezone)) return;

    const attemptKey = `${currentUser._id}|${deviceKey}`;
    if (lastTimezoneAttemptRef.current === attemptKey) return;
    lastTimezoneAttemptRef.current = attemptKey;

    try {
      const { timezone } = await userService.updateTimezone(deviceTimeZone);
      setUser((prevUser) => {
        if (!prevUser || prevUser._id !== currentUser._id) return prevUser;
        const updated: IAuthUser = { ...prevUser, timezone };
        persistUser(updated);
        return updated;
      });
    } catch (error) {
      console.error("Error al sincronizar la zona horaria:", error);
    }
  }, []);

  const userId = user?._id;
  const storedTimezone = user?.timezone;

  // Al hidratar o iniciar sesión, y cuando cambia la zona guardada
  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    void syncTimezone();
  }, [isAuthenticated, userId, storedTimezone, syncTimezone]);

  // Al volver a la pestaña, con debounce
  useEffect(() => {
    if (!isAuthenticated) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleVisibilityChange = () => {
      clearTimeout(timer);
      if (document.visibilityState !== "visible") return;
      timer = setTimeout(() => void syncTimezone(), TIMEZONE_SYNC_DEBOUNCE_MS);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, syncTimezone]);

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
