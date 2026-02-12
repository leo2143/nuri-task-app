import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts y Route Guards - NO usar lazy (siempre necesarios)
import ProtectedLayout from "../components/ProtectedLayout";
import PublicLayout from "../components/PublicLayout";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

// Loading component para Suspense fallback
import Loading from "../components/Loading";

// Páginas públicas - lazy loading
const Login = lazy(() => import("../pages/user/Login"));
const Register = lazy(() => import("../pages/user/Register"));
const ForgotPassword = lazy(() => import("../pages/user/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/user/ResetPassword"));

// Páginas protegidas - lazy loading
const Home = lazy(() => import("../pages/Home"));
const TaskList = lazy(() => import("../pages/tasks/TaskList"));
const TaskDetail = lazy(() => import("../pages/tasks/TaskDetail"));
const TaskForm = lazy(() => import("../pages/tasks/taskForm"));
const GoalList = lazy(() => import("../pages/goals/GoalList"));
const GoalDetail = lazy(() => import("../pages/goals/GoalDetail"));
const GoalForm = lazy(() => import("../pages/goals/GoalForm"));
const GoalSubGoalForm = lazy(() => import("../pages/goals/GoalSubGoalForm"));
const AchievementList = lazy(() => import("../pages/achievements/Achievements"));
const UserProfile = lazy(() => import("../pages/user/UserProfile"));
const Moodboard = lazy(() => import("../pages/moodboards/Moodboard"));
const Metrics = lazy(() => import("../pages/metrics/Metrics"));

// Páginas admin - lazy loading
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUser = lazy(() => import("../pages/admin/user/AdminUser"));
const AdminUserDetail = lazy(() => import("../pages/admin/user/AdminUserDetail"));
const AdminUserForm = lazy(() => import("../pages/admin/user/AdminUserForm"));
const AdminAchievement = lazy(() => import("../pages/admin/achievement/AdminAchievement"));
const AdminAchievementForm = lazy(() => import("../pages/admin/achievement/AdminAchievementForm"));
const AdminAchievementDetail = lazy(() => import("../pages/admin/achievement/AdminAchievementDetail"));

// Páginas de status - lazy loading
const NotFound = lazy(() => import("../pages/status/NotFound"));
const Forbidden = lazy(() => import("../pages/status/Forbidden"));

// Helper para envolver componentes en Suspense
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: withSuspense(NotFound),
    children: [
      {
        path: "/",
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: withSuspense(Login),
          },
          {
            path: "register",
            element: withSuspense(Register),
          },
          {
            path: "forgot-password",
            element: withSuspense(ForgotPassword),
          },
          {
            path: "reset-password",
            element: withSuspense(ResetPassword),
          },
        ],
      },
    ],
  },

  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: withSuspense(NotFound),
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: withSuspense(Home),
          },
          {
            path: "tasks",
            element: withSuspense(TaskList),
          },
          {
            path: "tasks/new",
            element: withSuspense(TaskForm),
          },
          {
            path: "tasks/:id/edit",
            element: withSuspense(TaskForm),
          },
          {
            path: "tasks/:id",
            element: withSuspense(TaskDetail),
          },
          {
            path: "goals",
            element: withSuspense(GoalList),
          },
          {
            path: "goals/:id",
            element: withSuspense(GoalDetail),
          },
          {
            path: "goals/new",
            element: withSuspense(GoalForm),
          },
          {
            path: "goals/:id/new/subgoal",
            element: withSuspense(GoalSubGoalForm),
          },
          {
            path: "goals/:id/edit",
            element: withSuspense(GoalForm),
          },
          {
            path: "achievements",
            element: withSuspense(AchievementList),
          },
          {
            path: "profile",
            element: withSuspense(UserProfile),
          },
          {
            path: "moodboard",
            element: withSuspense(Moodboard),
          },
          {
            path: "metrics",
            element: withSuspense(Metrics),
          },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: withSuspense(NotFound),
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: withSuspense(AdminDashboard),
          },
          {
            path: "users",
            element: withSuspense(AdminUser),
          },
          {
            path: "users/:id",
            element: withSuspense(AdminUserDetail),
          },
          {
            path: "users/new",
            element: withSuspense(AdminUserForm),
          },
          {
            path: "users/:id/edit",
            element: withSuspense(AdminUserForm),
          },
          {
            path: "achievements",
            element: withSuspense(AdminAchievement),
          },
          {
            path: "achievements/:id",
            element: withSuspense(AdminAchievementDetail),
          },
          {
            path: "achievements/new",
            element: withSuspense(AdminAchievementForm),
          },
          {
            path: "achievements/:id/edit",
            element: withSuspense(AdminAchievementForm),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
  {
    path: "/forbidden",
    element: withSuspense(Forbidden),
  },
]);
