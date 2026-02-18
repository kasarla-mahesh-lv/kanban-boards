import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "./types";

type Props = {
  task: Task;
  index: number;
};

const TaskCard = ({ task, index }: Props) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h5>{task.title}</h5>
          {task.description && <p>{task.description}</p>}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
