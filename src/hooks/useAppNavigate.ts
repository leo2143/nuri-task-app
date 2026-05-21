import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import type { NavigateOptions, To } from "react-router-dom";

/**
 * Wrapper de useNavigate que aplica viewTransition: true por defecto.
 * Centraliza la configuracion de transiciones para toda la app.
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, { ...options, viewTransition: true });
      }
    },
    [navigate]
  );
}
