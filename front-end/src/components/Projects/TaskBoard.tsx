import { useState } from "react";
import type { Task, TaskStatus } from "./types";
import KanbanColumn from "./KanbanCloumn";

const INITIAL_TASKS: Task[] = [
  { id: "1", projectId: "1", code: "PRJ-12", title: "Something", status: "backlog" },
  { id: "2", projectId: "1", code: "PRJ-16", title: "Header component", status: "todo" },
  { id: "3", projectId: "1", code: "PRJ-17", title: "Layout component", status: "inprogress" },
  { id: "4", projectId: "1", code: "PRJ-20", title: "Create APIs", status: "done" },
  { id: "5", projectId: "2", code: "PRJ-30", title: "HR Dashboard", status: "todo" },
];

type Props = {
  projectId: string;
};

const TaskBoard = ({ projectId }: Props) => {
  // 🔥 MASTER STATE (ALL TASKS)
  const [allTasks, setAllTasks] = useState<Task[]>(INITIAL_TASKS);

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setAllTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

  // 🔥 FILTER ONLY FOR DISPLAY
  const projectTasks = allTasks.filter(
    (t) => t.projectId === projectId
  );

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <KanbanColumn
        title="Backlog"
        status="backlog"
        tasks={projectTasks.filter((t) => t.status === "backlog")}
        onDropTask={moveTask}
      />
      <KanbanColumn
        title="Todo"
        status="todo"
        tasks={projectTasks.filter((t) => t.status === "todo")}
        onDropTask={moveTask}
      />
      <KanbanColumn
        title="In Progress"
        status="inprogress"
        tasks={projectTasks.filter((t) => t.status === "inprogress")}
        onDropTask={moveTask}
      />
      <KanbanColumn
        title="Done"
        status="done"
        tasks={projectTasks.filter((t) => t.status === "done")}
        onDropTask={moveTask}
      />
    </div>
  );
};

export default TaskBoard;