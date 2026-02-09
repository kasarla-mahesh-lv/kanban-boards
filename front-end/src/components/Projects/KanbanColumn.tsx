import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import type { Task } from "./types";

type Props = {
  title: string;
  status: Task["status"];
  tasks: Task[];
};

const KanbanColumn = ({ title, status, tasks }: Props) => {
  return (
    <Droppable droppableId={String(status)}>
      {(provided) => (
        <div
          className="kanban-column"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h4>{title}</h4>

          {tasks
            .filter((task) => task.status === status)
            .map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
