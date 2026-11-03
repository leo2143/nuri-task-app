
export interface ICompletionEntity {
  id: string;
  title: string;
}

export interface IUnlockedAchievement {
  id: string;
  title: string;
  description: string;
}

export interface ICompletionStreak {
  increased: boolean;
  current: number;
}

export interface ICompletionEvents {
  taskCompleted: ICompletionEntity | null;
  goalCompleted: ICompletionEntity | null;
  streak: ICompletionStreak | null;
  achievementsUnlocked: IUnlockedAchievement[];
}

export interface IWithCompletionEvents<T> {
  data: T;
  events: ICompletionEvents;
}

export const EMPTY_COMPLETION_EVENTS: ICompletionEvents = {
  taskCompleted: null,
  goalCompleted: null,
  streak: null,
  achievementsUnlocked: [],
};
