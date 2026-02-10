import axios from "axios";

/* ======================= AXIOS INSTANCE ======================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================= TYPES ======================= */
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

export type SendOtpPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type ResetPasswordPayload = {
  email: string;
  password: string;
};

/* ======================= LOGIN ======================= */
export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

/* ======================= REGISTER ======================= */
export const registerApi = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

/* ======================= SEND OTP ======================= */
export const sendOtpApi = async (payload: SendOtpPayload) => {
  const res = await api.post("/auth/send-otp", payload);
  return res.data;
};

/* ======================= VERIFY OTP ======================= */
export const verifyOtpApi = async (payload: VerifyOtpPayload) => {
  const res = await api.post("/auth/verify-otp", payload);
  return res.data;
};

/* ======================= RESET PASSWORD ======================= */
export const resetPasswordApi = async (
  payload: ResetPasswordPayload
) => {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
};

export default api;
