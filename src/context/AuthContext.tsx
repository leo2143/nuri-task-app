import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IAuthUser } from "../interfaces";

export interface AuthContextType {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  login: (user: IAuthUser, token: string) => void;
  logout: () => void;
  updateUser: (user: IAuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Exportar el contexto para que pueda ser usado por el hook
export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Inicializar desde localStorage al montar
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
  }, []);

  const login = (userData: IAuthUser, token: string) => {
    // Guardar en localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Actualizar estado
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Limpiar estado
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: IAuthUser) => {
    // Actualizar localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Actualizar estado
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
