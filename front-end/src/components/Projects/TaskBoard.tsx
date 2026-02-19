import React, { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import TaskDeatils from "./TaskDetail";

type Task = {
  id: number;
  title: string;
  description?: string;
  priority?: string;
};

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const addTask = (payload: any) => {
    const newTask = {
      id: Date.now(),
      ...payload,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setShowModal(true)}>+ Add Task</button>

      {/* TASK LIST */}
      <div style={{ marginTop: 20 }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-card"
            onClick={() => setSelectedTask(task)}
            style={{
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 10,
              marginBottom: 10,
              cursor: "pointer",
              background: "#f8fafc",
            }}
          >
            <b>{task.title}</b>
            <div>{task.priority}</div>
          </div>
        ))}
      </div>

      {/* ADD TASK MODAL */}
      {showModal && (
        <AddTaskModal
          columnTitle="Todo"
          onClose={() => setShowModal(false)}
          onAdd={addTask}
        />
      )}

      {/* TASK DETAILS DRAWER */}
      {selectedTask && (
        <TaskDeatils
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TaskBoard;
