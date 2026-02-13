
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
