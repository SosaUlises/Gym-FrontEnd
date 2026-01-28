import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { authStorage } from "../auth/authStorage";

export default function RequireAuth({
  roles,
  children,
}: {
  roles?: string[];
  children: ReactNode;
}) {
  const token = authStorage.getToken();
  if (!token) return <Navigate to="/login" replace />;

  if (roles?.length) {
    const role = authStorage.getRole();
    if (!role || !roles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}

