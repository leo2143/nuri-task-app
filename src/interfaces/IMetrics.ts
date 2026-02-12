export interface IAdminDashboardStats {
  totalUsers: number;
  subscribedUsers: number;
  totalGoals: number;
  totalAchievementTemplates: number;
  totalAchievementsCompleted: number;
}

export interface IUserCurrentStreak{
  currentStreak: number;
}

export interface IUserMetrics {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  currentStreak: number;
  bestStreak: number;
  totalTasksCompleted: number;
  totalGoalsCompleted: number;
  lastActivityDate: string | null;
  history: unknown[];
  createdAt: string;
  updatedAt: string;
  achievementsProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
}
