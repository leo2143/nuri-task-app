import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";
import Loading from "../components/Loading";

export default function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.isAdmin) return <Navigate to="/forbidden" replace />;

  return <Outlet />;
}
