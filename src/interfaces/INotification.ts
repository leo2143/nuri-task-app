export type NotificationType = "due_task" | "streak_risk" | "inactivity" | "streak_increase" | "achievement_completed";

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
