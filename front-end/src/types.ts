export type Status = "backlog" | "todo" | "progress" | "done";

export interface Task {
  id: string;
  title: string;
  status: Status;
}

export interface Project {
  id: string;
  name: string;
}
