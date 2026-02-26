

import type { AxiosError } from "axios";
import api from "./ApiCommon"; 


export type Permission = {
  _id: string;
  key?: string;
  name?: string;
  description?: string;
};

export type Role = {
  _id: string;
  name: "admin" | "manager" | "teamlead" | "employee";
  description?: string;
  permissionIds?: Array<string | Permission>;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};




const extractRolesArray = (payload: unknown): Role[] => {
  if (Array.isArray(payload)) {
    return payload as Role[];
  }

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.data)) return obj.data as Role[];
    if (Array.isArray(obj.roles)) return obj.roles as Role[];
  }

  throw new Error("Unexpected roles API response shape");
};

const getErrorMessage = (err: unknown): string => {
  const e = err as AxiosError<{ message?: string }>;
  return e?.response?.data?.message || e.message || "Request failed";
};




export const getAllRolesApi = async (): Promise<Role[]> => {
  try {
    const response = await api.get<unknown>("/roles");
    return extractRolesArray(response.data);
  } catch (error) {
    const err = error as AxiosError;

    
    if (err?.response?.status === 401) {
      throw new Error("Unauthorized (401). Please login again.");
    }

    throw new Error(getErrorMessage(error));
  }
};