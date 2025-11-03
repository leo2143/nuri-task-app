/**
 * Interface para el modelo de Metrics (Métricas de Progreso)
 * Representa las métricas detalladas y el seguimiento de una meta
 */

/**
 * Tendencias de progreso
 */
export type ProgressTrend = "improving" | "declining" | "stable" | "stagnant";

/**
 * Estados de ánimo durante el progreso
 */
export type ProgressMood =
  | "motivated"
  | "neutral"
  | "challenged"
  | "frustrated";

/**
 * Severidad de bloqueadores
 */
export type BlockerSeverity = "low" | "medium" | "high" | "critical";

/**
 * Tipos de alertas
 */
export type AlertType = "warning" | "danger" | "info" | "success";

/**
 * Estados de salud de la métrica
 */
export type HealthStatus = "excellent" | "good" | "at-risk" | "critical";

/**
 * Interface para hitos (milestones)
 */
export interface IMilestone {
  name: string;
  targetProgress: number;
  achieved: boolean;
  achievedDate?: Date | null;
  description?: string;
}

/**
 * Interface para bloqueadores
 */
export interface IBlocker {
  description: string;
  severity: BlockerSeverity;
  resolved: boolean;
  createdAt: Date;
  resolvedAt?: Date | null;
}

/**
 * Interface para logros semanales
 */
export interface IWeeklyWin {
  description: string;
  week: string;
  date: Date;
}

/**
 * Interface para desglose de tareas por prioridad
 */
export interface ITaskBreakdown {
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

/**
 * Interface para alertas
 */
export interface IAlert {
  type: AlertType;
  message: string;
  acknowledged: boolean;
  createdAt: Date;
}

/**
 * Interface para el historial semanal
 */
export interface IWeeklyHistory {
  week: string;
  totalCompletedTasks: number;
  totalTasks: number;
  missingTasks: number;
  progress: number;
  date: Date;
  timeInvested: number;
  notes?: string;
  mood?: ProgressMood;
  achievements?: string[];
}

/**
 * Interface para el modelo de Metrics
 */
export interface IMetrics {
  _id?: string;
  GoalId: string;
  currentWeek: string;
  currentProgress: number;
  currentNotes: string;
  totalCompletedTasks: number;
  totalTasks: number;
  missingTasks: number;

  // Métricas de velocidad y tendencias
  averageWeeklyProgress: number;
  progressTrend: ProgressTrend;
  taskCompletionRate: number;

  // Hitos y logros
  milestones: IMilestone[];
  currentStreak: number;
  bestStreak: number;

  // Métricas de calidad y eficiencia
  estimatedTimeInvested: number;
  efficiency: number;
  qualityScore: number;

  // Predicciones y proyecciones
  projectedCompletionDate?: Date | null;
  expectedProgress: number;
  progressDeviation: number;

  // Contexto y notas enriquecidas
  blockers: IBlocker[];
  weeklyWins: IWeeklyWin[];

  // Análisis de tareas
  taskBreakdown: ITaskBreakdown;
  overdueTasks: number;
  onTimeCompletionRate: number;

  // Alertas y notificaciones
  alerts: IAlert[];
  healthStatus: HealthStatus;

  // Historial
  history: IWeeklyHistory[];
  lastUpdated: Date;

  createdAt?: Date;
  updatedAt?: Date;

  // Propiedades virtuales
  currentCompletionPercentage?: number;
  activeBlockersCount?: number;
  unacknowledgedAlertsCount?: number;
  isAtRisk?: boolean;
}

/**
 * Interface para crear una nueva métrica
 */
export interface ICreateMetrics {
  GoalId: string;
  currentWeek: string;
  currentProgress?: number;
  currentNotes?: string;
  totalCompletedTasks?: number;
  totalTasks?: number;
  milestones?: IMilestone[];
}

/**
 * Interface para actualizar una métrica
 */
export interface IUpdateMetrics {
  currentWeek?: string;
  currentProgress?: number;
  currentNotes?: string;
  totalCompletedTasks?: number;
  totalTasks?: number;
  missingTasks?: number;
  qualityScore?: number;
  estimatedTimeInvested?: number;
}

/**
 * Interface para agregar un hito
 */
export interface IAddMilestone {
  name: string;
  targetProgress: number;
  description?: string;
}

/**
 * Interface para agregar un bloqueador
 */
export interface IAddBlocker {
  description: string;
  severity?: BlockerSeverity;
}

/**
 * Interface para agregar un logro semanal
 */
export interface IAddWeeklyWin {
  description: string;
  week: string;
}

/**
 * Interface para agregar una entrada al historial
 */
export interface IAddHistoryEntry {
  week: string;
  totalCompletedTasks: number;
  totalTasks: number;
  missingTasks: number;
  progress: number;
  timeInvested?: number;
  notes?: string;
  mood?: ProgressMood;
  achievements?: string[];
}
