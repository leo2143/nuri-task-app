import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ICompletionEvents } from "../interfaces";
import { AuthStateContext } from "./AuthContext";
import {
  dismissVisibleToast,
  enqueueToasts,
  eventsToToasts,
  initialToastQueueState,
  markVisibleToastLeaving,
} from "../utils/toastQueue";
import type { ToastItem } from "../utils/toastQueue";

export interface ToastState {
  current: ToastItem | null;
  version: number;
  lastStreak: number | null;
}

export interface ToastActions {
  notifyCompletion: (events: ICompletionEvents | null | undefined) => void;
  startExit: () => void;
  dismiss: () => void;
}

export type ToastContextType = ToastState & ToastActions;

interface InternalState {
  queue: typeof initialToastQueueState;
  lastStreak: number | null;
}

const initialInternalState: InternalState = {
  queue: initialToastQueueState,
  lastStreak: null,
};

type ToastReducerAction =
  | { type: "enqueue"; toasts: ToastItem[]; now: number }
  | { type: "streak"; current: number }
  | { type: "startExit" }
  | { type: "dismiss"; now: number }
  | { type: "reset" };

function toastReducer(
  state: InternalState,
  action: ToastReducerAction,
): InternalState {
  switch (action.type) {
    case "enqueue":
      return {
        ...state,
        queue: enqueueToasts(state.queue, action.toasts, action.now),
      };
    case "streak":
      return state.lastStreak === action.current
        ? state
        : { ...state, lastStreak: action.current };
    case "startExit":
      return { ...state, queue: markVisibleToastLeaving(state.queue) };
    case "dismiss":
      return {
        ...state,
        queue: dismissVisibleToast(state.queue, action.now),
      };
    case "reset":
      return initialInternalState;
  }
}

const ToastStateContext = createContext<ToastState | undefined>(undefined);
const ToastActionsContext = createContext<ToastActions | undefined>(undefined);

export { ToastStateContext, ToastActionsContext };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, initialInternalState);
  const idCounter = useRef(0);

  const userId = useContext(AuthStateContext)?.user?._id ?? null;
  const [ownerId, setOwnerId] = useState(userId);
  if (ownerId !== userId) {
    setOwnerId(userId);
    dispatch({ type: "reset" });
  }

  const notifyCompletion = useCallback(
    (events: ICompletionEvents | null | undefined) => {
      if (!events) return;

      if (events.streak) {
        dispatch({ type: "streak", current: events.streak.current });
      }

      const toasts = eventsToToasts(
        events,
        () => `toast-${(idCounter.current += 1)}`,
      );
      if (toasts.length > 0) {
        dispatch({ type: "enqueue", toasts, now: Date.now() });
      }
    },
    [],
  );

  const startExit = useCallback(() => {
    dispatch({ type: "startExit" });
  }, []);

  const dismiss = useCallback(() => {
    dispatch({ type: "dismiss", now: Date.now() });
  }, []);

  const stateValue = useMemo<ToastState>(
    () => ({
      current: state.queue.visible,
      version: state.queue.version,
      lastStreak: state.lastStreak,
    }),
    [state.queue.visible, state.queue.version, state.lastStreak],
  );

  const actionsValue = useMemo<ToastActions>(
    () => ({ notifyCompletion, startExit, dismiss }),
    [notifyCompletion, startExit, dismiss],
  );

  return (
    <ToastStateContext.Provider value={stateValue}>
      <ToastActionsContext.Provider value={actionsValue}>
        {children}
      </ToastActionsContext.Provider>
    </ToastStateContext.Provider>
  );
}
