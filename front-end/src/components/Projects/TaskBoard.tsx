import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

import { createProjectColumnApi, updateTaskApi } from "../Api/ApiCommon";

import KanbanColumn from "./KanbanColumn";
import type { Project, Task } from "./types";
import type { Column } from "../Api/ApiCommon";

type Props = {
  project: Project;
  tasks: Task[];
  columns: Column[];
  refreshColumns: () => void;
};

const TaskBoard = ({ project, tasks, columns, refreshColumns }: Props) => {

  // ✅ move useState inside component
  const [showInput, setShowInput] = useState(false);
  const [columnName, setColumnName] = useState("");

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

  const handleAddColumn = async () => {
    if (!columnName.trim()) return;

    try {
      await createProjectColumnApi(project._id, columnName);
      await refreshColumns();

      setColumnName("");
      setShowInput(false);
    } catch (error) {
      console.error("Failed to create column", error);
    }
  };

  return (
    <div className="task-board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">

          {columns.map((col) => (
            <KanbanColumn
              key={col._id}
              title={col.title}
              status={col.key as Task["status"]}
              tasks={tasks}
            />
          ))}

          {showInput ? (
            <div className="add-column-box">
              <input
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                placeholder="Enter column name"
              />
              <button onClick={handleAddColumn}>Add Group</button>
              <button onClick={() => setShowInput(false)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowInput(true)}>
              + Add Column
            </button>
          )}

        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
