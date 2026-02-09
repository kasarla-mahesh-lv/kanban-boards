import React, { createContext, useContext, useMemo, useState } from "react";

type AuthUser = { id?: number | string; name?: string; email?: string } | null;

type AuthContextType = {
  token: string | null;
  user: AuthUser;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser>(() => {
    const u = localStorage.getItem("user");
    return u ? (JSON.parse(u) as AuthUser) : null;
  });

  const login = (newToken: string, newUser?: AuthUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

