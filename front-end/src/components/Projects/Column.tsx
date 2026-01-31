import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import type { Task } from "../../types";

interface Props {
  id: string;
  title: string;
  tasks: Task[];
}

export default function Column({ id, title, tasks }: Props) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 w-72 p-4 rounded-xl min-h-[400px]"
    >
      {/* Column title */}
      <h2 className="font-semibold mb-4">{title}</h2>

      {/* Tasks */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} id={task.id} title={task.title} />
        ))}
      </SortableContext>
    </div>
  );
}
