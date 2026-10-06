import { useContext } from "react";
import {
  AuthStateContext,
  AuthActionsContext,
} from "../context/AuthContext";
import type {
  AuthActions,
  AuthContextType,
  AuthState,
} from "../context/AuthContext";

/**
 * Estado de auth (user, flags). No se suscribe a login/logout.
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export function useAuthState(): AuthState {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState debe ser usado dentro de un AuthProvider");
  }
  return context;
}

/**
 * Acciones de auth. Identidad estable; no se pinta si cambia user/isLoading.
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export function useAuthActions(): AuthActions {
  const context = useContext(AuthActionsContext);
  if (context === undefined) {
    throw new Error("useAuthActions debe ser usado dentro de un AuthProvider");
  }
  return context;
}

/**
 * Merge de estado + acciones. Los guards y páginas mixtas siguen acá.
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export function useAuth(): AuthContextType {
  return { ...useAuthState(), ...useAuthActions() };
}
