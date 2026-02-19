
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
    projectId: string;
    columnId: string;
  }) => Promise<void> | void;
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
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) return alert("Task title is required");

    try {
      setSaving(true);
      await onAdd({ title, description, priority, projectId, columnId });
      onClose();
    } catch (e: any) {
      alert(e?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Add Task</h3>
          <p>{columnTitle}</p>
        </div>

        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            placeholder="Enter task name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button  className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
