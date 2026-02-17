import axios, { AxiosError, type AxiosRequestConfig } from "axios";

/* ======================= AXIOS INSTANCE ======================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ======================= TOKEN INTERCEPTOR ======================= */
api.interceptors.request.use((config) => {
  // Try to get token from multiple storage locations
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    // Ensure token is properly formatted
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  console.log("API Request:", {
    url: config.url,
    method: config.method,
    token: token ? "Present" : "Missing"
  });

  return config;
});

/* ======================= COMMON ERROR HANDLER ======================= */
const extractErrorMessage = (err: unknown): string => {
  const error = err as AxiosError<any>;
  console.error("API Error:", {
    message: error?.message,
    response: error?.response?.data,
    status: error?.response?.status
  });
  
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

// ... (keep all the existing code above, only update these types and function)

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
  newPassword: string; 
  confirmPassword: string; 
  otp?: string;
};
export type CreateTaskPayload = {
  title: string;
  description?: string;
  priority?: string;
  projectId: string;
  columnId: string;
};

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return { 
    ...res.data,
    requiresOtp:true
    
  };
};

export const verifyOtpApi = async (payload: VerifyOtpPayload): Promise<any> => {
  const data = {
    email: payload.email,
    otp: payload.otp,
    type: payload.type || "register"
  };
  
  const res = await api
.post("/auth/verify-otp", data);
  
  if (payload.type === "login" && res.data.token) {
    localStorage.setItem("token", res.data.token);
    sessionStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  
  return res.data;
};

export const registerApi = (payload: RegisterPayload) =>
  apiPost<RegisterResponse, RegisterPayload>("/auth/register", payload);

export const sendOtpApi = (payload: SendOtpPayload) =>
  apiPost<any, SendOtpPayload>("/auth/send-otp", payload);

export const resendOtpApi = async (payload: SendOtpPayload & { type?: "register" | "login" | "reset" }) => {
  if (payload.type === "login") {
    throw new Error("Please use the login button to resend OTP");
  } else if (payload.type === "reset") {
    return apiPost<any, SendOtpPayload>("/auth/forgot-password", payload);
  } else {
    throw new Error("Please use the register button to resend OTP");
  }
};

export const forgotPasswordApi = (payload: SendOtpPayload) =>
  apiPost<any, SendOtpPayload>("/auth/forgot-password", payload);

// FIXED: Updated to use ResetPasswordPayload type
export const resetPasswordApi = (payload: ResetPasswordPayload) =>
  apiPost<any, ResetPasswordPayload>("/auth/reset-password", payload);

export const logoutApi = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

export type CreateTaskResponse = {
  message?: string;
  task: Task; 
};




// ... (rest of your Api/ApiCommon.ts remains the same)
/* ======================= PROJECT TYPES ======================= */
export type Project = { _id: string; title: string; description?: string };
export type Task = { _id: string; title: string; description?: string; priority?: string };
export type Column = { _id: string; title: string; key: string; tasks: Task[] };

// FIXED: Member type to match backend schema
export type Member = { 
  _id: string;        // Changed from 'id' to '_id' to match MongoDB
  name: string; 
  email: string; 
  avatar?: string;
  projectId?: string;
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
  apiGet<Column[]>(`/projects/get-columns-tasks?projectId=${projectId}`);

export const createColumnApi = (projectId: string, payload: { title: string }) =>
  apiPost<Column, typeof payload>(`/columns/boards/${projectId}/columns`, payload);

 export const createTaskApi = (payload: CreateTaskPayload) =>
  apiPost<CreateTaskResponse, CreateTaskPayload>("/projects/create-task", payload);

/* ======================= MEMBERS API CALLS ======================= */
// export const getProjectMembersApi = (projectId: string): Promise<Member[]> =>
//   apiGet<Member[]>(`/projects/${projectId}/members`);
// export const searchProjectMembersApi = (projectId: string, query: string): Promise<Member[]> =>
//   apiGet<Member[]>(`/projects/${projectId}/members/search`, { params: { q: query } });

/* ======================= MEMBERS API CALLS ======================= */
// export const getProjectMembersApi = (projectId: string): Promise<Member[]> =>
//   apiGet<Member[]>(`/projects/${projectId}/members`);

// export const searchProjectMembersApi = (projectId: string, query: string): Promise<Member[]> =>
//   apiGet<Member[]>(`/projects/${projectId}/members/search`, { params: { q: query } });

/* ======================= TEAM/MEMBERS API CALLS ======================= */
// FIXED: Get project members with proper mapping
export const getProjectMembersApi = async (projectId: string): Promise<Member[]> => {
  try {
    console.log("Fetching members for project:", projectId);
    const response = await apiGet<any[]>(`/team/project/${projectId}`);
    console.log("Raw members response:", response);
    
    // Map backend _id to frontend _id
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

// FIXED: Search members with proper filtering
export const searchProjectMembersApi = async (projectId: string, query: string): Promise<Member[]> => {
  try {
    console.log("Searching members for project:", projectId, "query:", query);
    // Since backend doesn't have a search endpoint, we'll fetch all and filter
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



// FIXED: Create team member with proper response handling
export const createTeamMemberApi = async (projectId: string, payload: { name: string; email: string }): Promise<Member> => {
  try {
    console.log("Creating team member with payload:", { ...payload, projectId });
    
    const response = await apiPost<any>('/team', { 
      ...payload, 
      projectId 
    });
    
    console.log("Create team member response:", response);
    
    // Check if response has teamMember property (from your backend)
    const memberData = response.teamMember || response;
    
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

// FIXED: Delete team member with better error handling
export const deleteTeamMemberApi = async (memberId: string): Promise<{ message: string }> => {
  try {
    console.log("Attempting to delete member with ID:", memberId);
    
    // Validate ID format
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
      
      // Throw a more descriptive error
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

















