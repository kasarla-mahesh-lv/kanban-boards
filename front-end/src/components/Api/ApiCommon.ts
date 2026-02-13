import axios, { AxiosError, type AxiosRequestConfig } from "axios";

/* ======================= AXIOS INSTANCE ======================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ======================= TOKEN INTERCEPTOR ======================= */
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
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

/* ======================= AUTH TYPES ======================= */
export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  message: string;
  token?: string;
  user?: { id: string; name?: string; email: string };
  requiresOtp?: boolean;
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
export type VerifyOtpPayload = { 
  email: string; 
  otp: string; 
  type?: "register" | "login" | "reset" 
};

export type ResetPasswordPayload = { 
  email: string; 
  password: string;
  otp?: string; // Some implementations send OTP in body
};


export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  // Login API doesn't return token, only sends OTP
  return { 
    ...res.data, 
    requiresOtp: true 
  };
};

/**
 * VERIFY OTP - For registration, login, and password reset
 * Backend: POST /auth/verify-otp with type parameter
 */
export const verifyOtpApi = async (payload: VerifyOtpPayload): Promise<any> => {
  const data = {
    email: payload.email,
    otp: payload.otp,
    type: payload.type || "register"
  };
  
  const res = await api.post("/auth/verify-otp", data);
  
  // If this is login verification and token is returned, store it
  if (payload.type === "login" && res.data.token) {
    localStorage.setItem("token", res.data.token);

    sessionStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  
  return res.data;
};

/**
 * REGISTER - Send OTP for registration
 * Backend: POST /auth/register
 */
export const registerApi = (payload: RegisterPayload) =>
  apiPost<RegisterResponse, RegisterPayload>("/auth/register", payload);

/**
 * SEND OTP - Generic OTP sender (used for registration and forgot password)
 * Backend: POST /auth/register (for registration) or /auth/forgot-password (for reset)
 */
export const sendOtpApi = (payload: SendOtpPayload) =>
  apiPost<any, SendOtpPayload>("/auth/send-otp", payload);

/**
 * REMOVED: verifyLoginOtpApi - Use verifyOtpApi with type="login" instead
 */

/**
 * RESEND OTP - Not directly supported in your backend
 * Use this carefully - it calls the appropriate endpoint based on context
 */
export const resendOtpApi = async (payload: SendOtpPayload & { type?: "register" | "login" | "reset" }) => {
  if (payload.type === "login") {
    // For login, we need to call login API again
    // This should be handled in the component with stored credentials
    throw new Error("Please use the login button to resend OTP");
  } else if (payload.type === "reset") {
    // For password reset
    return apiPost<any, SendOtpPayload>("/auth/forgot-password", payload);
  } else {
    // For registration
    // Note: Your backend doesn't have a separate resend endpoint
    // You might need to call register API again
    throw new Error("Please use the register button to resend OTP");
  }
};

/**
 * FORGOT PASSWORD - Send OTP for password reset
 * Backend: POST /auth/forgot-password
 */
export const forgotPasswordApi = (payload: SendOtpPayload) =>
  apiPost<any, SendOtpPayload>("/auth/forgot-password", payload);

/**
 * RESET PASSWORD - Reset password using OTP
 * Backend: POST /auth/reset-password
 */
export const resetPasswordApi = (payload: ResetPasswordPayload) =>
  apiPost<any, ResetPasswordPayload>("/auth/reset-password", payload);

/**
 * LOGOUT - Clear local storage
 */
export const logoutApi = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

/* ======================= PROJECT TYPES ======================= */
export type Project = { _id: string; title: string; description?: string };
export type Task = { _id: string; title: string; description?: string; priority?: string };
export type Column = { _id: string; title: string; key: string; tasks: Task[] };
export type Member = { id: string; name: string; email: string; avatar?: string };
export type TaskType = { id: string; name: string; color?: string; icon?: string };
export type Milestone = { id: string; name: string; dueDate?: string; status?: string };
export type BlockRelation = { id: string; title: string; type: string; status: string };
export type FilterPreset = {
  id: string;
  name: string;
  filters: any;
  projectId: string;
  createdBy: string;
  createdAt: string;
};

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

/* ======================= MEMBERS API CALLS ======================= */
export const getProjectMembersApi = (projectId: string): Promise<Member[]> =>
  apiGet<Member[]>(`/projects/${projectId}/members`);
export const searchProjectMembersApi = (projectId: string, query: string): Promise<Member[]> =>
  apiGet<Member[]>(`/projects/${projectId}/members/search`, { params: { q: query } });

/* ======================= TASK TYPES API CALLS ======================= */
export const getProjectTypesApi = (projectId: string): Promise<TaskType[]> =>
  apiGet<TaskType[]>(`/projects/${projectId}/types`);

/* ======================= MILESTONES API CALLS ======================= */
export const getProjectMilestonesApi = (projectId: string): Promise<Milestone[]> =>
  apiGet<Milestone[]>(`/projects/${projectId}/milestones`);

/* ======================= BLOCKERS API CALLS ======================= */
export const getBlockersApi = (projectId: string): Promise<BlockRelation[]> =>
  apiGet<BlockRelation[]>(`/tasks/blockers`, { params: { projectId } });
export const getBlockingApi = (projectId: string): Promise<BlockRelation[]> =>
  apiGet<BlockRelation[]>(`/tasks/blocking`, { params: { projectId } });

/* ======================= FILTER PRESETS API CALLS ======================= */
export const getFilterPresetsApi = (projectId: string): Promise<FilterPreset[]> =>
  apiGet<FilterPreset[]>(`/projects/${projectId}/filters/presets`);
export const saveFilterPresetApi = (projectId: string, payload: { name: string; filters: any }) =>
  apiPost<FilterPreset, typeof payload>(`/projects/${projectId}/filters/presets`, payload);
export const updateFilterPresetApi = (projectId: string, presetId: string, payload: { name?: string; filters?: any }) =>
  apiPut<FilterPreset, typeof payload>(`/projects/${projectId}/filters/presets/${presetId}`, payload);
export const deleteFilterPresetApi = (projectId: string, presetId: string) =>
  apiDelete<{ message: string }>(`/projects/${projectId}/filters/presets/${presetId}`);

/* ======================= FILTER OPTIONS API CALLS ======================= */
export const getFilterOptionsApi = (projectId: string): Promise<{
  types: TaskType[];
  milestones: Milestone[];
  members: Member[];
  blockers: BlockRelation[];
  blocking: BlockRelation[];
}> => apiGet(`/projects/${projectId}/filters/options`);

export const applyFiltersApi = (projectId: string, filters: any) =>
  apiPost<{ columns: Column[] }, any>(`/projects/${projectId}/tasks/filter`, filters);

export default api;