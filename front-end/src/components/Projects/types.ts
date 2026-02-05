<<<<<<< HEAD

=======
>>>>>>> 46f5bd4392fd85db61bd38c89c6544bbcbdad7ac
export type TaskStatus = "backlog" | "todo" | "inprogress" | "done";

export type Task = {
  id: string;
  projectId: string;
  code: string;
  title: string;
  status: TaskStatus;
};