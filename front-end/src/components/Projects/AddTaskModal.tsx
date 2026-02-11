import React, { useState } from "react";
import "../Api/ApiCommon"


type Props = {
  columnTitle: string;
  onClose: () => void;
  onAdd: (payload: { title: string; description?: string; priority?: string }) => Promise<void> | void;
};

const AddTaskModal: React.FC<Props> = ({ columnTitle, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    try {
      setSaving(true);
      await onAdd({ title, description, priority });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">Add Task</h3>
          <p className="modal-sub">{columnTitle}</p>
        </div>

        <div className="form-group">
          <label className="label">Title</label>
          <input
            className="input"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="label">Description</label>
          <textarea
            className="textarea"
            placeholder="Write short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="label">Priority</label>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
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
