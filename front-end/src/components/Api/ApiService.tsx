import api from "./Apiwrapper";

/* ================= LOGIN TYPES ================= */

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
};

/* ================= REGISTER TYPES ================= */

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  mobilenumber: string;
};

export type RegisterResponse = {
  message: string;
  userId: string;
};

/* ================= LOGIN API ================= */

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

/* ================= REGISTER API ================= */

export const registerApi = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};
