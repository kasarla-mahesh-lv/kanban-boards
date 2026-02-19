import React, { useState } from "react";

type Props = {
  columnTitle: string;
  projectId: string;
  columnId: string;

  onClose: () => void;
  onAdd: (payload: {
    title: string;
    description?: string;
    priority?: string;
  }) => void;
};

const AddTaskModal: React.FC<Props> = ({
  columnTitle,
  projectId,
  columnId,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  const submit = () => {
    if (!title.trim()) return;

    onAdd({ title, description, priority });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Add Task</h3>
        <p>{columnTitle}</p>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button onClick={submit}>Add Task</button>
      </div>
    </div>
  );
};

export default AddTaskModal;

