<<<<<<< HEAD
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
=======
import { useState } from "react";
import type { Task, TaskStatus } from "./types";
import KanbanColumn from "./KanbanColumn";
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f

import KanbanColumn from "./KanbanColumn";
import { updateTaskApi } from "../Api/ApiService";
import type { Project, Task } from "./types";

type Props = {
  project: Project;
  tasks: Task[];
};

<<<<<<< HEAD
const TaskBoard = ({ project, tasks }: Props) => {
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as Task["status"];

    try {
      await updateTaskApi(project._id, taskId, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update task status", error);
    }
  };

=======
const TaskBoard = ({ projectId }: Props) => {

  const [allTasks, setAllTasks] = useState<Task[]>(INITIAL_TASKS);

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setAllTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );
  };

    
  const projectTasks = allTasks.filter(
    (t) => t.projectId === projectId
  );

>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
  return (
    <div className="task-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          <KanbanColumn title="Todo" status="todo" tasks={tasks} />
          <KanbanColumn
            title="In Progress"
            status="inprogress"
            tasks={tasks}
          />
          <KanbanColumn title="Done" status="done" tasks={tasks} />
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
