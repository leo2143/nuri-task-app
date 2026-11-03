import { useContext } from "react";
import { ToastStateContext, ToastActionsContext } from "../context/ToastContext";
import type {
  ToastActions,
  ToastContextType,
  ToastState,
} from "../context/ToastContext";

export function useToastState(): ToastState {
  const context = useContext(ToastStateContext);
  if (context === undefined) {
    throw new Error("useToastState debe ser usado dentro de un ToastProvider");
  }
  return context;
}

export function useToastActions(): ToastActions {
  const context = useContext(ToastActionsContext);
  if (context === undefined) {
    throw new Error("useToastActions debe ser usado dentro de un ToastProvider");
  }
  return context;
}

export function useToast(): ToastContextType {
  const state = useToastState();
  const actions = useToastActions();
  return { ...state, ...actions };
}
