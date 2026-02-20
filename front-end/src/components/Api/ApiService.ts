import axios from "axios";

/* ======================= AXIOS INSTANCE ======================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // change if needed
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================= TOKEN INTERCEPTOR ======================= */
api.interceptors.request.use((config) => {
  // Change from sessionStorage to localStorage to match your Login component
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  return config;
});

/* ======================= TYPES ======================= */
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token?: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
  requiresOtp?: boolean; // Optional flag if backend indicates OTP requirement
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
  
  // DON'T store token here anymore - we'll store it after OTP verification
  // Just return the response data with token from headers or response body
  const token = res.headers.authorization || res.headers.Authorization || res.data.token;
  
  console.log(res, "=============");
  
  return {
    ...res.data,
    token: token
  };
};

/**
 * ✅ NEW API: Verify OTP and get final token for login
 */
export const verifyLoginOtpApi = async (
  payload: VerifyOtpPayload
): Promise<LoginResponse> => {
  const res = await api.post("/auth/verify-login-otp", payload);
  
  const token = res.headers.authorization || res.headers.Authorization || res.data.token;
  
  if (res.status === 200 && token) {
    // Store token in localStorage after OTP verification
    localStorage.setItem("token", token);
    // Store user data
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  
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

/* ======================= RESEND OTP ======================= */
/**
 * ✅ NEW API: Resend OTP
 */
export const resendOtpApi = async (payload: SendOtpPayload) => {
  const res = await api.post("/auth/resend-otp", payload);
  return res.data;
};

/* ======================= RESET PASSWORD ======================= */
export const resetPasswordApi = async (
  payload: ResetPasswordPayload
) => {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
};

/* ======================= LOGOUT ======================= */
/**
 * ✅ NEW API: Logout
 */
export const logoutApi = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token"); // Clean up sessionStorage too
};

export type Project = {
  _id: string;
  title: string;
  description?: string;
};

export type Column = {
  _id: string;
  title: string;
  key: string;
  tasks: any[];
};

export default api;

/* ======================= PROJECT APIs ======================= */
export const getProjectsApi = async (): Promise<Project[]> => {
  const res = await api.get("/projects");
  return res.data;
};

export const createProjectApi = async (payload: {
  title: string;
  description?: string;
}): Promise<Project> => {
  const res = await api.post("/projects", payload);
  return res.data;
};

// Uncomment if needed
// export const deleteProjectApi = async (projectId: string): Promise<void> => {
//   await api.delete(`/projects/${projectId}`);
// };

/* ======================= COLUMNS APIs ======================= */
export const getProjectColumnsApi = async (
  projectId: string
): Promise<Column[]> => {
  const res = await api.get(`/columns/boards/${projectId}/columns`);
  return res.data;
};