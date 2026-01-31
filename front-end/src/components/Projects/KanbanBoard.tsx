import {
  DndContext,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import Column from "./Column";
import type { Task,Status} from "../../types";

interface Props {
  projectId: string;
}

export default function KanbanBoard({ projectId }: Props) {
  // Example: different tasks per project
  const initialData: Record<string, Task[]> = {
    p1: [
      { id: "1", title: "Header component", status: "todo" },
      { id: "2", title: "Create APIs", status: "backlog" },
    ],
    p2: [{ id: "3", title: "Patient module", status: "progress" }],
    p3: [],
  };

  const [tasks, setTasks] = useState<Task[]>(
    initialData[projectId] || []
  );

  const statuses: Status[] = ["backlog", "todo", "progress", "done"];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id
          ? { ...task, status: over.id as Status }
          : task
      )
    );
  };

  const addTask = (status: Status) => {
    const title = prompt("Task name?");
    if (!title) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title,
        status,
      },
    ]);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-6">
        {statuses.map((status) => (
          <div key={status}>
            <Column
              id={status}
              title={status.toUpperCase()}
              tasks={tasks.filter((t) => t.status === status)}
            />

            <button
              onClick={() => addTask(status)}
              className="text-blue-600 text-sm mt-2"
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
