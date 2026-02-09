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

/* ================= PROJECT TYPES ================= */

export type Project = {
  _id: string;
  title:string;
  description?:string;
  createdAt?:string;
  updatedAt?:string;
};

/* ================= PROJECT API ================= */

export const getProjectsApi = async (): Promise<Project[]> => {
  const res = await api.get("/projects");
  return Array.isArray(res.data) ? res.data : [];
};

export const createProjectApi = async (payload: {
  title: string;
  description?: string;
}): Promise<Project> => {
  const res = await api.post("/projects", payload);
  return res.data;
};

export const getProjectByIdApi = async (
  projectId: string
): Promise<Project> => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data;
};


/* ================= TASK TYPES ================= */

export type TaskStatus = "Backlog"|"todo" | "inprogress" | "done";

export type Task = {
  _id: string;              // ✅ backend uses _id
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: string;
  createdAt?: string;
  updatedAt?: string;
};

/* ================= TASK API ================= */

export const getTasksByProjectApi = async (
  projectId: string
): Promise<Task[]> => {
  const res = await api.get<Task[]>(`/projects/${projectId}/tasks`);
  return res.data
};

export const createTaskApi = async (
  projectId: string,
  payload: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: string;
  }
): Promise<Task> => {
  const res = await api.post(
    `/projects/${projectId}/tasks`,
    payload
  );
  return res.data;
};

export const updateTaskApi = async (
  projectId: string,
  taskId: string,
  payload: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: string;
  }>
): Promise<Task> => {
  const res = await api.patch(
    `/projects/${projectId}/tasks/${taskId}`,
    payload
  );
  return res.data;
};

export const deleteTaskApi = async (
  projectId: string,
  taskId: string
) => {
  const res = await api.delete(
    `/projects/${projectId}/tasks/${taskId}`
  );
  return res.data;
};
