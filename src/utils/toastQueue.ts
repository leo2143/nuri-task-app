import type { ICompletionEvents } from "../interfaces";

export type ToastKind = "achievement" | "goal" | "streak" | "task";

export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  message: string;
  count?: number;
}

export interface ToastQueueState {
  visible: ToastItem | null;
  visibleLeaving: boolean;
  pending: ToastItem[];
  version: number;
  recentTask: { count: number; at: number } | null;
}

export const MAX_PENDING_TOASTS = 3;
export const TASK_MERGE_WINDOW_MS = 2000;

export const TOAST_PRIORITY: Record<ToastKind, number> = {
  achievement: 4,
  goal: 3,
  streak: 2,
  task: 1,
};

export const TASK_SINGLE_MESSAGE = "¡Una menos! Lo estas haciendo bien";
export const TASK_GROUP_MESSAGE = "¡Qué Ritmo! Lo estas haciendo increible";
export const GOAL_MESSAGE = "No dejaste nada atrás ¡Llegaste al final!✨  ";
export const STREAK_MESSAGE = "Seguí nadando así, Nuri te acompaña";

export const initialToastQueueState: ToastQueueState = {
  visible: null,
  visibleLeaving: false,
  pending: [],
  version: 0,
  recentTask: null,
};

export function eventsToToasts(
  events: ICompletionEvents,
  createId: () => string,
): ToastItem[] {
  const toasts: ToastItem[] = [];

  for (const achievement of events.achievementsUnlocked) {
    toasts.push({
      id: createId(),
      kind: "achievement",
      title: achievement.title,
      message: achievement.description,
    });
  }

  if (events.goalCompleted) {
    toasts.push({
      id: createId(),
      kind: "goal",
      title: events.goalCompleted.title,
      message: GOAL_MESSAGE,
    });
  }

  if (events.streak?.increased && events.achievementsUnlocked.length === 0) {
    const days = events.streak.current;
    toasts.push({
      id: createId(),
      kind: "streak",
      title: days === 1 ? "¡1 día seguido!" : `¡${days} días seguidos!`,
      message: STREAK_MESSAGE,
    });
  }

  if (events.taskCompleted && toasts.length === 0) {
    toasts.push({
      id: createId(),
      kind: "task",
      title: events.taskCompleted.title,
      message: TASK_SINGLE_MESSAGE,
      count: 1,
    });
  }

  return toasts;
}

function groupTask(target: ToastItem, count: number): ToastItem {
  return {
    ...target,
    count,
    title: `${count} tareas completadas`,
    message: TASK_GROUP_MESSAGE,
  };
}

function mergeTask(target: ToastItem): ToastItem {
  return groupTask(target, (target.count ?? 1) + 1);
}

function sortByPriority(items: ToastItem[]): ToastItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        TOAST_PRIORITY[b.item.kind] - TOAST_PRIORITY[a.item.kind] ||
        a.index - b.index,
    )
    .map(({ item }) => item);
}

export function enqueueToasts(
  state: ToastQueueState,
  incoming: ToastItem[],
  now: number,
): ToastQueueState {
  if (incoming.length === 0) return state;

  let { visible, visibleLeaving, version, recentTask } = state;
  let pending = [...state.pending];

  for (const toast of incoming) {
    if (toast.kind === "task") {
      if (visible?.kind === "task" && !visibleLeaving) {
        visible = mergeTask(visible);
        version += 1;
        continue;
      }
      const queuedIndex = pending.findIndex((item) => item.kind === "task");
      if (queuedIndex !== -1) {
        pending[queuedIndex] = mergeTask(pending[queuedIndex]);
        continue;
      }
      if (recentTask && now - recentTask.at < TASK_MERGE_WINDOW_MS) {
        pending.push(groupTask(toast, recentTask.count + 1));
        recentTask = null;
        continue;
      }
    }
    pending.push(toast);
  }

  pending = sortByPriority(pending);

  if (!visible && pending.length > 0) {
    visible = pending[0];
    visibleLeaving = false;
    pending = pending.slice(1);
    version += 1;
  }

  return {
    visible,
    visibleLeaving,
    pending: pending.slice(0, MAX_PENDING_TOASTS),
    version,
    recentTask,
  };
}

export function markVisibleToastLeaving(
  state: ToastQueueState,
): ToastQueueState {
  if (!state.visible || state.visibleLeaving) return state;
  return { ...state, visibleLeaving: true };
}

export function dismissVisibleToast(
  state: ToastQueueState,
  now: number,
): ToastQueueState {
  if (!state.visible) return state;
  const [next, ...rest] = state.pending;
  return {
    visible: next ?? null,
    visibleLeaving: false,
    pending: rest,
    version: state.version + 1,
    recentTask:
      state.visible.kind === "task"
        ? { count: state.visible.count ?? 1, at: now }
        : state.recentTask,
  };
}
