import React from "react";

export type Role = "ADMIN" | "MANAGER" | "TL" | "EMPLOYEE";

interface PermissionGateProps {
  role: Role;                 
  allow: Role[];             
  children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  role,
  allow,
  children,
}) => {
  if (!allow.includes(role)) return null;
  return <>{children}</>;
};

export default PermissionGate;

