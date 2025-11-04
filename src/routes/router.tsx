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

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
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
            path: "tasks/:id",
            element: <TaskDetail />,
          },
        ],
      },
    ],
  },
]);
