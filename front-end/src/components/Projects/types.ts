export type TaskStatus = "todo" | "inprogress" | "done";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: string;
};

export type Project = {
  _id: string;
  title: string;
  description?: string;
};

