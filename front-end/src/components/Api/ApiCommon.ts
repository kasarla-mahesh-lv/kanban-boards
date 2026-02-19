// front-end/src/components/Api/ApiCommon.ts
import axios, { AxiosError, type AxiosRequestConfig } from "axios";


/* ======================= AXIOS INSTANCE ======================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ======================= TOKEN INTERCEPTOR ======================= */
api.interceptors.request.use((config) => {
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

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.config?.url}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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

/* ======================= AUTH TYPES ======================= */
export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  message: string;
  token?: string;
  user?: { id: string; name?: string; email: string; mfaEnabled?: boolean };
  requiresOtp?: boolean;
  otpSent?: boolean;
  mfaRequired?: boolean;
  mfaEnabled?: boolean;
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
  type?: "register" | "login" | "reset" | "mfa" 
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

export type CreateTaskResponse = {
  message?: string;
  task: Task; 
};

/* ======================= AUTH API CALLS ======================= */
export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    console.log("📝 Login API called with:", payload.email);
    const res = await api.post("/auth/login", payload);
    console.log("✅ Login response:", res.data);
    console.log("✅ Login headers:", res.headers);
    
    // Check if token is in authorization header (MFA disabled - direct login)
    if (res?.headers?.authorization) {
      console.log("🎉 Token received in headers - MFA disabled");
      const token = res.headers.authorization;
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
      
      // When MFA is disabled, we get token directly
      if (res.data.user) {
        const userData = {
          ...res.data.user,
          mfaEnabled: false
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ User data saved with MFA disabled:", userData);
      }
      
      return {
        ...res.data,
        token: token,
        requiresOtp: false,
        mfaRequired: false
      };
    }
    
    // Check if token is in response data (MFA disabled - direct login)
    if (res.data.token) {
      console.log("🎉 Token received in response data - MFA disabled");
      localStorage.setItem("token", res.data.token);
      sessionStorage.setItem("token", res.data.token);
      
      if (res.data.user) {
        const userData = {
          ...res.data.user,
          mfaEnabled: false
        };
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ User data saved with MFA disabled:", userData);
      }
      
      return {
        ...res.data,
        requiresOtp: false,
        mfaRequired: false
      };
    }
    
    // Check if MFA is required (user has MFA enabled)
    if (!res.data.token && res.data.message && res.data.message.includes("OTP")) {
      console.log("🔐 MFA required - OTP sent");
      
      // IMPORTANT: Check if token is in headers even for MFA required case
      // The backend might still send a token for the MFA session
      if (res?.headers?.authorization) {
        const token = res.headers.authorization;
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        console.log("🎉 Token stored for MFA session from headers");
      }
      
      return {
        ...res.data,
        mfaRequired: true,
        requiresOtp: true,
        otpSent: true
      };
    }
    
    // Check if OTP is required (login with OTP flow)
    const message = res.data.message || "";
    const otpSent = message.toLowerCase().includes("otp sent") ||
                    message.toLowerCase().includes("sent to email");

    if (otpSent) {
      console.log("📧 OTP sent to email");
      return {
        ...res.data,
        requiresOtp: true,
        otpSent: true
      };
    }

    return res.data;
  } catch (error) {
    console.error("❌ Login API error:", error);
    throw error;
  }
};

/**
 * VERIFY OTP - For registration, login, and password reset
 * Backend: POST /auth/verify-otp with type parameter
 */
export const verifyOtpApi = async (payload: VerifyOtpPayload): Promise<any> => {
  try {
    const data = {
      email: payload.email,
      otp: payload.otp,
      type: payload.type || "register"
    };

    console.log("🔐 Verifying OTP with data:", data);
    const res = await api.post("/auth/verify-otp", data);
    console.log("✅ Verify OTP response:", res.data);
    console.log("✅ Verify OTP headers:", res.headers);

    // Handle login verification with token in headers
    if (payload.type === "login") {
      if (res?.headers?.authorization) {
        console.log("🎉 Login successful, storing token from headers");
        const token = res.headers.authorization;
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        
        // For normal login OTP verification, MFA remains disabled
        if (res.data.user) {
          const userData = {
            ...res.data.user,
            mfaEnabled: false
          };
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data saved with MFA disabled:", userData);
        }
        
        return {
          ...res.data,
          token: token,
          success: true
        };
      }
      
      if (res.data.token) {
        console.log("🎉 Login successful, storing token from response");
        localStorage.setItem("token", res.data.token);
        sessionStorage.setItem("token", res.data.token);
        
        if (res.data.user) {
          const userData = {
            ...res.data.user,
            mfaEnabled: false
          };
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data saved with MFA disabled:", userData);
        }
        
        return {
          ...res.data,
          success: true
        };
      }
    }

    // Handle MFA verification for login (when MFA is enabled)
    if (payload.type === "mfa") {
      if (res?.headers?.authorization) {
        const token = res.headers.authorization;
        localStorage.setItem("token", token);
        sessionStorage.setItem("token", token);
        
        // IMPORTANT: When MFA verification succeeds, MFA is enabled
        if (res.data.user) {
          const userData = {
            ...res.data.user,
            mfaEnabled: true
          };
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data saved with MFA ENABLED:", userData);
        } else {
          // If no user data in response, create one with MFA enabled
          const userData = {
            id: '',
            name: '',
            email: payload.email,
            mfaEnabled: true
          };
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data created with MFA ENABLED:", userData);
        }
        
        return {
          ...res.data,
          token: token,
          success: true
        };
      }
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        sessionStorage.setItem("token", res.data.token);
        
        if (res.data.user) {
          const userData = {
            ...res.data.user,
            mfaEnabled: true
          };
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data saved with MFA ENABLED:", userData);
        } else {
          const userData = {
            id: '',
            name: '',
            email: payload.email,
            mfaEnabled: true
          };
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data created with MFA ENABLED:", userData);
        }
        
        return {
          ...res.data,
          success: true
        };
      }
    }

    return {
      ...res.data,
      success: true
    };
  } catch (error) {
    console.error("❌ Verify OTP API error:", error);
    throw error;
  }
};

/**
 * REGISTER - Register new user
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
 * RESEND OTP - Handle OTP resend based on context
 */
export const resendOtpApi = async (payload: SendOtpPayload & { type?: "register" | "login" | "reset" }) => {
  try {
    console.log("📝 Resend OTP API called with:", payload);
    
    if (payload.type === "login") {
      throw new Error("Please use the login button to resend OTP");
    } else if (payload.type === "reset") {
      return await forgotPasswordApi(payload);
    } else {
      throw new Error("Please use the register button to resend OTP");
    }
  } catch (error) {
    console.error("❌ Resend OTP API error:", error);
    throw error;
  }
};

/* ======================= MFA APIs ======================= */

/**
 * GET MFA STATUS FROM USER - Read from localStorage
 */
export const getMfaStatusFromUser = (): boolean => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      console.log("📊 MFA status from localStorage:", user.mfaEnabled);
      return user.mfaEnabled === true;
    }
    return false;
  } catch (e) {
    console.error("Failed to get MFA status from user:", e);
    return false;
  }
};

/**
 * UPDATE USER MFA STATUS - Update localStorage
 */
export const updateUserMfaStatus = (enabled: boolean): void => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      user.mfaEnabled = enabled;
      localStorage.setItem("user", JSON.stringify(user));
      console.log(`✅ User MFA status updated to: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    } else {
      console.warn("No user data found in localStorage");
    }
  } catch (e) {
    console.error("Failed to update user MFA status:", e);
  }
};

/**
 * CHECK MFA STATUS - This is a fallback if you add the endpoint later
 */
export const checkMfaStatusApi = async (email: string): Promise<{ mfaEnabled: boolean }> => {
  try {
    console.log("🔐 Checking MFA status for:", email);
    // Try to get from localStorage first
    const status = getMfaStatusFromUser();
    return { mfaEnabled: status };
  } catch (error) {
    console.error("❌ Check MFA status error:", error);
    return { mfaEnabled: false };
  }
};

/**
 * REQUEST MFA OTP - Send OTP to enable MFA
 * Backend: PATCH /auth/mfa/request
 */
export const requestMfaOtpApi = async (): Promise<{ message: string }> => {
  try {
    console.log("🔐 Requesting MFA OTP");
    
    // Ensure we have a valid token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const res = await api.patch("/auth/mfa/request", {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Request MFA OTP response:", res.data);
    
    // Update token if provided in headers
    if (res?.headers?.authorization) {
      const newToken = res.headers.authorization;
      localStorage.setItem("token", newToken);
      sessionStorage.setItem("token", newToken);
    }
    
    return res.data;
  } catch (error) {
    console.error("❌ Request MFA OTP error:", error);
    throw error;
  }
};

/**
 * VERIFY MFA OTP - Verify and enable MFA (for login or enabling)
 * Backend: PATCH /auth/mfa/verify
 */
export const verifyMfaOtpApi = async (otp: string): Promise<{ message: string; mfaEnabled: boolean; token?: string }> => {
  try {
    console.log("🔐 Verifying MFA OTP");
    
    // Ensure we have a valid token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    console.log("Using token for MFA verify:", token.substring(0, 20) + "...");
    
    const res = await api.patch("/auth/mfa/verify", { otp }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Verify MFA OTP response:", res.data);
    console.log("✅ Verify MFA OTP headers:", res.headers);
    
    // Get token from headers if present (new token after MFA enable)
    let newToken = null;
    if (res?.headers?.authorization) {
      newToken = res.headers.authorization;
      localStorage.setItem("token", newToken);
      sessionStorage.setItem("token", newToken);
      console.log("✅ New token stored after MFA verification");
    }
    
    // IMPORTANT: After verification, update localStorage
    if (res.data.mfaEnabled === true) {
      updateUserMfaStatus(true);
    }
    
    return {
      ...res.data,
      token: newToken || res.data.token
    };
  } catch (error) {
    console.error("❌ Verify MFA OTP error:", error);
    throw error;
  }
};

/**
 * REQUEST DISABLE MFA OTP - Send OTP to disable MFA
 * Backend: PATCH /auth/mfa/disable/request
 */
export const requestDisableMfaOtpApi = async (): Promise<{ message: string }> => {
  try {
    console.log("🔐 Requesting Disable MFA OTP");
    
    // Ensure we have a valid token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    // FIXED: Correct endpoint is /auth/mfa/disable/request, not /auth/mfa/disable
    const res = await api.patch("/auth/mfa/disable/request", {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Disable MFA OTP response:", res.data);
    
    // Update token if provided in headers
    if (res?.headers?.authorization) {
      const newToken = res.headers.authorization;
      localStorage.setItem("token", newToken);
      sessionStorage.setItem("token", newToken);
    }
    
    return res.data;
  } catch (error) {
    console.error("❌ Disable MFA OTP error:", error);
    throw error;
  }
};

/**
 * VERIFY DISABLE MFA OTP - Verify and disable MFA
 * Backend: PATCH /auth/mfa/disable/verify
 */
export const verifyDisableMfaOtpApi = async (otp: string): Promise<{ message: string; mfaEnabled: boolean; token?: string }> => {
  try {
    console.log("🔐 Verifying Disable MFA OTP");
    
    // Ensure we have a valid token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const res = await api.patch("/auth/mfa/disable/verify", { otp }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Disable MFA verify response:", res.data);
    console.log("✅ Disable MFA verify headers:", res.headers);

    // Get token from headers if present
    let newToken = null;
    if (res?.headers?.authorization) {
      newToken = res.headers.authorization;
      localStorage.setItem("token", newToken);
      sessionStorage.setItem("token", newToken);
      console.log("✅ New token stored after MFA disable");
    }

    // IMPORTANT: After verification, update localStorage
    if (res.data.mfaEnabled === false) {
      updateUserMfaStatus(false);
    }

    return {
      ...res.data,
      token: newToken || res.data.token
    };
  } catch (error) {
    console.error("❌ Disable MFA verify error:", error);
    throw error;
  }
};

/**
 * DISABLE MFA - Direct disable (use with caution)
 * Backend: PATCH /auth/mfa/disable
 */
export const disableMfaApi = async (): Promise<{ message: string; mfaEnabled: boolean }> => {
  try {
    console.log("🔐 Disabling MFA");
    
    // Ensure we have a valid token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const res = await api.patch("/auth/mfa/disable", {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("✅ Disable MFA response:", res.data);
    
    // Update token if provided in headers
    if (res?.headers?.authorization) {
      const newToken = res.headers.authorization;
      localStorage.setItem("token", newToken);
      sessionStorage.setItem("token", newToken);
    }
    
    // Update localStorage
    if (res.data.mfaEnabled === false) {
      updateUserMfaStatus(false);
    }
    
    return res.data;
  } catch (error) {
    console.error("❌ Disable MFA error:", error);
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
  console.log("👋 Logged out successfully");
};

// ... (rest of your existing code for projects, teams, etc. remains the same)

// ... (rest of your Api/ApiCommon.ts remains the same)
/* ======================= PROJECT TYPES ======================= */
export type Project = { _id: string; title: string; description?: string };
export type Task = { _id: string; title: string; description?: string; priority?: string };
export type Column = { _id: string; title: string; key: string; tasks: Task[] };

export type Member = {
  _id: string;
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
export const getProjectsApi = (): Promise<Project[]> => 
  apiGet<Project[]>("/projects");

export const createProjectApi = (payload: { title: string; description?: string }): Promise<Project> =>
  apiPost<Project, typeof payload>("/projects", payload);

export const updateProjectApi = (id: string, payload: { title?: string; description?: string }): Promise<Project> =>
  apiPut<Project, typeof payload>(`/projects/${id}`, payload);

export const deleteProjectApi = (id: string): Promise<{ message: string }> =>
  apiDelete<{ message: string }>(`/projects/${id}`);

/* ======================= COLUMNS API CALLS ======================= */
export const getProjectColumnsApi = (projectId: string): Promise<Column[]> =>
  apiGet<Column[]>(`/projects/get-columns-tasks?projectId=${projectId}`);

export const createColumnApi = (projectId: string, payload: { title: string }): Promise<Column> =>
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

export const createTeamMemberApi = async (projectId: string, payload: { name: string; email: string }): Promise<Member> => {
  try {
    console.log("Creating team member with payload:", { ...payload, projectId });

    const response = await apiPost<any>('/team', {
      ...payload,
      projectId
    });

    console.log("Create team member response:", response);

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

export const applyFiltersApi = (projectId: string, filters: any): Promise<{ columns: Column[] }> =>
  apiPost<{ columns: Column[] }, any>(`/projects/${projectId}/tasks/filter`, filters);

export default api;