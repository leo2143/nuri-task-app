import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook para acceder al contexto de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 * @returns {AuthContextType} El contexto de autenticación con user, isAuthenticated, login, logout, updateUser
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
