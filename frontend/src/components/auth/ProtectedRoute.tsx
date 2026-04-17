import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { UserRole } from "../../types";
import { useAuth } from "../features/login/hooks/useAuth";

export default function ProtectedRoute() {
  const { loading, user, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-400 font-medium">
          Verificando acceso...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const validRoles: UserRole[] = ["IT", "ADMIN", "PROVEEDOR", "CONSUMIDOR"];

  if (!hasRole(validRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
