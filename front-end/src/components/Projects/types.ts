export type TaskStatus = "backlog" | "todo" | "inprogress" | "done";

export type Task = {
  id: string;
  projectId: string;
  code: string;
  title: string;
  status: TaskStatus;
};