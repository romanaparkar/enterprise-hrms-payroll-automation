// Gate for authenticated routes.
// - While the saved token is being verified → show a spinner.
// - Not logged in → redirect to /login.
// - Logged in but wrong role (if allowedRoles given) → redirect home.
// - Otherwise render the nested routes via <Outlet/>.

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth.types";
import Spinner from "../components/ui/Spinner";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
