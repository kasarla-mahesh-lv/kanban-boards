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
export const apiPatch = async <T, P = any>(
  url: string,
  payload?: P,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const res = await api.patch<T>(url, payload, config);
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
  requiresOtp?:boolean;
  user?: { id: string; name?: string; email: string };
  mfaRequired?: boolean;
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


export type ResetPasswordPayload={
  email:string;
  newPassword:string;
  confirmPassword:string;
  otp?:string;
};

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const res = await api.post("/auth/login", payload);

    if (res?.headers?.authorization) {
      localStorage.setItem("token", res.headers.authorization);
      sessionStorage.setItem("token", res.headers.authorization);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    }

    const message = res.data.message || "";
    const otpSent =
      message.toLowerCase().includes("otp sent") ||
      message.toLowerCase().includes("sent to email");

    return {
      ...res.data,
      requiresOtp: otpSent,
    };
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};


export type CreateTaskPayload={
  title:string;
  description?:string;
  priority?:string;
  projectId:string;
  columnId:string;
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
  if (payload.type === "login" && res?.headers?.authorization) {
    console.log("Login succcessful,storing token");
    localStorage.setItem("token", res?.headers?.authorization);

    sessionStorage.setItem("token", res?.headers?.authorization);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  
  return res.data;
};

/**
 * REGISTER - Send OTP for registration
 * Backend: POST /auth/register
 */
export const registerApi = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    console.log("📝 Register API called with:", payload.email);
    const res = await api.post("/auth/register", payload);
    console.log("✅ Register response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Register API error:", error);
    throw error;
  }
};

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
export const forgotPasswordApi = async (payload: SendOtpPayload): Promise<any> => {
  try {
    console.log("📝 Forgot password API called with:", payload.email);
    const res = await api.post("/auth/forgot-password", payload);
    console.log("✅ Forgot password response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Forgot password API error:", error);
    throw error;
  }
};

/**
 * RESET PASSWORD - Reset password using OTP
 * Backend: POST /auth/reset-password
 */
export const resetPasswordApi = async (payload: ResetPasswordPayload): Promise<any> => {
  try {
    console.log("📝 Reset password API called with:", payload.email);
    const res = await api.post("/auth/reset-password", payload);
    console.log("✅ Reset password response:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Reset password API error:", error);
    throw error;
  }
};

/**
 * LOGOUT - Clear local storage
 */
export const logoutApi = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

export type CreateTaskResponse = {
  message?: string;
  task: Task; 
};




/* ======================= PROJECT TYPES ======================= */
export type Project = { _id: string; title: string; description?: string };
export type Task = { _id: string; title: string; description?: string; priority?: string;status?:string;assignee?:{id:string};createdBy?:{id:string};completed?:boolean;isFavorite?:boolean;isFollowed?:boolean; };
export type Column = { _id: string; name: string; order?:number; tasks: Task[] };
export type Member = {
  _id: string;
  name: string;
  email: string;
  projectId?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};

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
  apiGet<Column[]>(
    `/columns/${projectId}/columns`
  );


export const createProjectColumnApi = (
  projectId: string,
  name: string
) =>
  apiPost<Column, { name: string }>(
    `/columns/${projectId}/columns`,
    { name }
  );
  export const updateTaskApi = (
  taskId: string,
  payload: Partial<Task>
) =>
  apiPut<Task, Partial<Task>>(`/tasks/${taskId}`, payload);


/* ======================= TEAM/MEMBERS API CALLS ======================= */
export const getProjectMembersApi = async (projectId: string): Promise<Member[]> => {
  try {
    console.log("Fetching members for project:", projectId);
    const response = await apiGet<any[]>(`/team/project/${projectId}`);
    console.log("Raw members response:", response);

    return response.map(member => ({
      _id: member._id,
      name: member.name,
      email: member.email,
      projectId: member.projectId,
      avatar: member.avatar,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt
    }));
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
};

export const searchProjectMembersApi = async (projectId: string, query: string): Promise<Member[]> => {
  try {
    console.log("Searching members for project:", projectId, "query:", query);
    const members = await getProjectMembersApi(projectId);
    const filtered = members.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered members:", filtered);
    return filtered;
  } catch (error) {
    console.error("Error searching project members:", error);
    throw error;
  }
 };



/* ======================= TEAM/MEMBERS API CALLS ======================= */

type CreateTeamMembersResponse = {
  teamMember?: Member;
} & Member;


export const createTeamMemberApi = async (projectId: string, payload: { name: string; email: string }): Promise<Member> => {
  try {
    console.log("Creating team member with payload:", { ...payload, projectId });

    const response = await apiPost<CreateTeamMembersResponse>('/team', {
      ...payload,
      projectId
    });

    console.log("Create team member response:", response);

    const memberData = response.teamMember ?? response;

    return {
      _id: memberData._id,
      name: memberData.name,
      email: memberData.email,
      projectId: memberData.projectId,
      createdAt: memberData.createdAt,
      updatedAt: memberData.updatedAt
    };
  } catch (error) {
    console.error("Error creating team member:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    }
    throw error;
  }
};

export const deleteTeamMemberApi = async (memberId: string): Promise<{ message: string }> => {
  try {
    console.log("Attempting to delete member with ID:", memberId);

    if (!memberId || memberId.length !== 24) {
      console.warn("Member ID might be invalid:", memberId);
    }

    const response = await apiDelete<any>(`/team/${memberId}`);
    console.log("Delete response:", response);

    return response;
  } catch (error) {
    console.error("Error deleting team member:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      throw new Error(error.response?.data?.message || `Failed to delete member (Status: ${error.response?.status})`);
    }
    throw error;
  }
};


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
