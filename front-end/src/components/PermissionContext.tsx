import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// import {c
//   getCurrentUserApi,
//   fetchPermissionsApi,
// } from "../api/permissionApi";

interface User {
  id: string;
  name: string;
  role: string;
}

interface PermissionContextType {
  user: User | null;
  permissions: string[];
  loading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | null>(null);

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Restore user on refresh
//   useEffect(() => {
//     const restoreUser = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const data = await getCurrentUserApi();
//         setUser(data.user);
//         setPermissions(data.permissions);
//       } catch (error) {
//         localStorage.removeItem("token");
//       } finally {
//         setLoading(false);
//       }
//     };

//     restoreUser();
//   }, []);

  // 🔥 Login
  const login = useCallback(async (data: any) => {
    setUser(data.user);
    localStorage.setItem("token", data.token);

    const permissions = await fetchPermissionsApi();
    setPermissions(permissions);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("token");
  }, []);

  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  const value = useMemo(
    () => ({
      user,
      permissions,
      loading,
      login,
      logout,
      hasPermission,
    }),
    [user, permissions, loading, login, logout, hasPermission]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermission = () => {
  const context = useContext(PermissionContext);
  if (!context) throw new Error("usePermission must be used inside PermissionProvider");
  return context;
};