import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks";
import Loading from "../components/Loading";

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <Loading />;
  }
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
