import { Navigate } from "react-router-dom";
import { usePermission } from "./PermissionContext";

interface Props {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute = ({ children, requiredPermission }: Props) => {
  const { user, hasPermission, loading } = usePermission();

  // ✅ Wait until auth check completes
  if (loading) {
    return <div>Loading...</div>;
  }

  // 🔐 Check login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Check permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allow access
  return <>{children}</>;
};

export default ProtectedRoute;