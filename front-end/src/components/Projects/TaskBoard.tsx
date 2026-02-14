import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import KanbanColumn from "./KanbanColumn";

import type { Project, Task } from "./types";

type Props = {
  project: Project;
  tasks: Task[];
};

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
