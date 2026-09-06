import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types";

export function ProtectedRoute({ allow }: { allow: UserRole[] }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/sign-in" replace />;
  }
  if (!allow.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />;
}
