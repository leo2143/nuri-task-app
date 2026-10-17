export type NotificationType =
  | "due_task"
  | "streak_risk"
  | "inactivity"
  | "streak_increase"
  | "achievement_completed"
  | "high_priority_upcoming"
  | "overdue_task"
  | "overdue_goal"
  | "goal_completed"
  | "empty_goal"
  | "day_recap"
  | "due_goal"
  | "high_priority_upcoming_goal"
  | "stalled_goal"
  | "pause_too_long"
  | "overdue_backlog"
  | "moodboard_nudge"
  | "premium_nag";

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  url: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
