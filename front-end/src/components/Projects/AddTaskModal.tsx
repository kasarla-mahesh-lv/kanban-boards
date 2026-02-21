import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type AddTaskPayload = {
  title: string;
  description?: string;
  priority?: string;
  projectId: string;
  columnId: string;
};

interface Props {
  columnTitle: string;
  projectId: string;
  columnId: string;
  onClose: () => void;
  onAdd: (payload: AddTaskPayload) => Promise<void>;
}

const PRIORITIES = ["Low", "Medium", "High"] as const;
type Priority = (typeof PRIORITIES)[number];

/* =========================================================
   ✅ 3-DOTS MENU (Edit/Delete) — SAME FILE ONLY
   Use this in your Task UI (task card top-right)
========================================================= */
type TaskKebabMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

type Pos = { top: number; left: number };

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export const TaskKebabMenu: React.FC<TaskKebabMenuProps> = ({
  onEdit,
  onDelete,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  const close = () => setOpen(false);

  const computePosition = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();
    const menuWidth = 170;

    let left = r.right - menuWidth;
    const top = r.bottom + 6;

    // if goes too far left, align with button left
    if (left < 8) left = r.left;

    setPos({
      top: clamp(top, 8, window.innerHeight - 8),
      left: clamp(left, 8, window.innerWidth - menuWidth - 8),
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    computePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      close();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const onReposition = () => computePosition();

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  const toggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setOpen((v) => !v);
  };

  const menu =
    open && pos
      ? createPortal(
          <div className="task-menu-portal">
            <div
              ref={menuRef}
              className="task-menu"
              role="menu"
              style={{ top: pos.top, left: pos.left }}
            >
              <button
                type="button"
                className="task-menu-item"
                role="menuitem"
                onClick={() => {
                  onEdit();
                  close();
                }}
              >
                Edit
              </button>

              <button
                type="button"
                className="task-menu-item danger"
                role="menuitem"
                onClick={() => {
                  onDelete();
                  close();
                }}
              >
                Delete
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="kebab-btn"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        title="Actions"
      >
        ⋮
      </button>
      {menu}
    </>
  );
};

/* =========================================================
   ADD TASK MODAL
========================================================= */
const AddTaskModal: React.FC<Props> = ({
  columnTitle,
  projectId,
  columnId,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [saving, setSaving] = useState<boolean>(false);

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => titleInputRef.current?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required");
      titleInputRef.current?.focus();
      return;
    }

    try {
      setSaving(true);

      await onAdd({
        title: title.trim(),
        description: description.trim() ? description.trim() : undefined,
        priority,
        projectId,
        columnId,
      });

      onClose();
    } catch (error: unknown) {
      console.error("Failed to add task:", error);
      const msg =
        error instanceof Error
          ? error.message
          : "Failed to create task. Please try again.";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const onOverlayMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const modal = (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-task-modal-title"
      onMouseDown={onOverlayMouseDown}
    >
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 id="add-task-modal-title">Add Task</h3>
          <p>
            Add a new task into <b>{columnTitle}</b>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              ref={titleInputRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={4}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              disabled={saving}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-ghost"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="btn-primary"
            >
              {saving ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default AddTaskModal;
