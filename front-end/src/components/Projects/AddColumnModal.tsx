import React, { useState } from "react";


type Props = {
  onClose: () => void;
  onAdd: (payload: { title: string; key: string }) => Promise<void> | void;
};

const AddColumnModal: React.FC<Props> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;

    // key auto generate
    const key = title.toLowerCase().replace(/\s+/g, "");

    try {
      setSaving(true);
      await onAdd({ title, key });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 className="modal-title">Add Column</h3>
        </div>

        <div className="form-group">
          <label className="label">Column Name</label>
          <input
            className="input"
            placeholder="Eg: Review / Blocked / QA"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit} disabled={saving}>
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddColumnModal;
