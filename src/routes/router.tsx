import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";
import PublicLayout from "../components/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import ForgotPassword from "../pages/user/ForgotPassword";
import ResetPassword from "../pages/user/ResetPassword";
import Home from "../pages/Home";
import TaskList from "../pages/tasks/TaskList";
import TaskDetail from "../pages/tasks/TaskDetail";
import NotFound from "../pages/status/NotFound";
import TaskForm from "../pages/tasks/taskForm";
import GoalList from "../pages/goals/GoalList";
import GoalDetail from "../pages/goals/GoalDetail";
import GoalForm from "../pages/goals/GoalForm";
import GoalSubGoalForm from "../pages/goals/GoalSubGoalForm";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Forbidden from "../pages/status/Forbidden";
import AdminLayout from "../components/AdminLayout";
import AdminUser from "../pages/admin/user/AdminUser";
import AdminUserDetail from "../pages/admin/user/AdminUserDetail";
import AdminUserForm from "../pages/admin/user/AdminUserForm";
import AdminAchievement from "../pages/admin/achievement/AdminAchievement";
import AdminAchievementForm from "../pages/admin/achievement/AdminAchievementForm";
import AdminAchievementDetail from "../pages/admin/achievement/AdminAchievementDetail";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password",
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },

  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "tasks",
            element: <TaskList />,
          },
          {
            path: "tasks/new",
            element: <TaskForm />,
          },
          {
            path: "tasks/:id/edit",
            element: <TaskForm />,
          },

          {
            path: "tasks/:id",
            element: <TaskDetail />,
          },
          {
            path: "goals",
            element: <GoalList />,
          },
          {
            path: "goals/:id",
            element: <GoalDetail />,
          },
          {
            path: "goals/new",
            element: <GoalForm />,
          },
          {
            path: "goals/:id/new/subgoal",
            element: <GoalSubGoalForm />,
          },
          {
            path: "goals/:id/edit",
            element: <GoalForm />,
          },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <NotFound />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },

          {
            path: "users",
            element: <AdminUser />,
          },
          {
            path: "users/:id",
            element: <AdminUserDetail />,
          },
          {
            path: "users/new",
            element: <AdminUserForm />,
          },
          {
            path: "users/:id/edit",
            element: <AdminUserForm />,
          },

          {
            path: "achievements",
            element: <AdminAchievement />,
          },
          {
            path: "achievements/:id",
            element: <AdminAchievementDetail />,
          },
          {
            path: "achievements/new",
            element: <AdminAchievementForm />,
          },
          {
            path: "achievements/:id/edit",
            element: <AdminAchievementForm />,
          },
        ],
      },
    ],
  },
  // Ruta catch-all para páginas no encontradas
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
  },
]);
