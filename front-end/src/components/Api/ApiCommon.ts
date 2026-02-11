import axios, { AxiosError, type AxiosRequestConfig } from "axios";


/* ======================= AXIOS INSTANCE ======================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // example: https://.../api
  headers: { "Content-Type": "application/json" },
});

/* ======================= TOKEN INTERCEPTOR ======================= */
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    // token "Bearer xxx" format lo store chesthe direct ga set avuthundi
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  return config;
});

/* ======================= COMMON ERROR HANDLER ======================= */
const extractErrorMessage = (err: unknown): string => {
  const error = err as AxiosError<any>;
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};

/* ======================= COMMON HTTP FUNCTIONS ======================= */
/** ✅ GET */
export const apiGet = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await api.get<T>(url, config);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/** ✅ POST */
export const apiPost = async <T, P = any>(
  url: string,
  payload?: P,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await api.post<T>(url, payload, config);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/** ✅ PUT */
export const apiPut = async <T, P = any>(
  url: string,
  payload?: P,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await api.put<T>(url, payload, config);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/** ✅ DELETE */
export const apiDelete = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await api.delete<T>(url, config);
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err));
  }
};

/* ======================= TYPES (Your App) ======================= */
export type LoginPayload = { email: string; password: string };

export type LoginResponse = {
  token?: string;
  user: { id: string; name?: string; email: string };
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

export type SendOtpPayload = { email: string };
export type VerifyOtpPayload = { email: string; otp: string };
export type ResetPasswordPayload = { email: string; password: string };

export type Project = { _id: string; title: string; description?: string };

export type Task = {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
};

export type Column = {
  _id: string;
  title: string;
  key: string;
  tasks: Task[];
};

/* ======================= AUTH API CALLS ======================= */
export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  // login ki interceptor token avasaram ledu
  const res = await api.post<LoginResponse>("/auth/login", payload);

  // token header nundi vasthe
  const authHeader =
    res.headers["authorization"] || res.headers["Authorization"];

  if (res.status === 200 && authHeader) {
    // store full "Bearer xxx" or plain token
    sessionStorage.setItem("token", authHeader);
  }

  return res.data;
};

export const registerApi = (payload: RegisterPayload) =>
  apiPost<RegisterResponse, RegisterPayload>("/auth/register", payload);

export const sendOtpApi = (payload: SendOtpPayload) =>
  apiPost<any, SendOtpPayload>("/auth/send-otp", payload);

export const verifyOtpApi = (payload: VerifyOtpPayload) =>
  apiPost<any, VerifyOtpPayload>("/auth/verify-otp", payload);

export const resetPasswordApi = (payload: ResetPasswordPayload) =>
  apiPost<any, ResetPasswordPayload>("/auth/reset-password", payload);

/* ======================= PROJECT API CALLS ======================= */
export const getProjectsApi = () => apiGet<Project[]>("/projects");

export const createProjectApi = (payload: { title: string; description?: string }) =>
  apiPost<Project, typeof payload>("/projects", payload);

export const updateProjectApi = (id: string, payload: { title?: string; description?: string }) =>
  apiPut<Project, typeof payload>(`/projects/${id}`, payload);

export const deleteProjectApi = (id: string) =>
  apiDelete<{ message: string }>(`/projects/${id}`);

/* ======================= COLUMNS API CALLS ======================= */
export const getProjectColumnsApi = (projectId: string) =>
  apiGet<Column[]>(`/columns/boards/${projectId}/columns`);

export const createColumnApi = (projectId: string, payload: { title: string }) =>
  apiPost<Column, typeof payload>(`/columns/boards/${projectId}/columns`, payload);

/* ======================= EXPORT AXIOS INSTANCE (optional) ======================= */
export default api;
