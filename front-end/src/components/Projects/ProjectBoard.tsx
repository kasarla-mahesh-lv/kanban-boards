import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import {
  type Project,
  getProjectColumnsApi,
  createTaskApi,
  createColumnApi,
  updateTaskApi,
  type Task,
  type Column,
} from "../Api/ApiCommon";
import FilterPanel from "./FilterPanel";
import AddTaskModal from "./AddTaskModal";
import "./Project.css";

const DEFAULT_COLUMNS = ["Backlog", "Todo", "In Progress", "Done"];

interface Filters {
  search: string;
  assignedToMe: boolean;
  assignees: string[];
  dueDateOptions: string[];
  dueDateRange: { start: string | null; end: string | null };
  priority: string[];
  types: string[];
  milestones: string[];
  noBlockers: boolean;
  selectedBlockers: string[];
  noBlocking: boolean;
  selectedBlocking: string[];
  creationDate: { start: string | null; end: string | null };
  completed: boolean | null;
  createdByMe: boolean;
  selectCreators: string[];
  favorites: boolean;
  followed: boolean;
  exactMatch: boolean;
}

const defaultFilters: Filters = {
  search: "",
  assignedToMe: false,
  assignees: [],
  dueDateOptions: [],
  dueDateRange: { start: null, end: null },
  priority: [],
  types: [],
  milestones: [],
  noBlockers: false,
  selectedBlockers: [],
  noBlocking: false,
  selectedBlocking: [],
  creationDate: { start: null, end: null },
  completed: null,
  createdByMe: false,
  selectCreators: [],
  favorites: false,
  followed: false,
  exactMatch: false,
};

type UIColumn = {
  _id: string;
  title: string;
  key: string;
  order?: number;
  tasks: Task[];
};

const makeDefaultColumns = (): UIColumn[] =>
  DEFAULT_COLUMNS.map((t, idx) => ({
    _id: `temp-${idx}`,
    title: t,
    key: t.toLowerCase().replace(/\s/g, ""),
    order: idx,
    tasks: [],
  }));

type EditDraft = {
  taskId: string;
  columnId: string;
  title: string;
  description: string;
  priority: string;
};

type TaskMenuState = {
  taskId: string;
  columnId: string;
  task: Task;
  x: number;
  y: number;
};

const MENU_WIDTH = 180;
const MENU_HEIGHT = 92;
const MENU_GAP = 8;

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project] = useState<Project | null>(null);

  const [columns, setColumns] = useState<UIColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const [showAddInput, setShowAddInput] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  const [showAddTask, setShowAddTask] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const [menu, setMenu] = useState<TaskMenuState | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /**
   * ✅ IMPORTANT:
   * Always prefer Mongo `_id` first.
   * Many backends return `taskId` as relation id, NOT the task document _id.
   */
  const getTaskId = (t: Task): string => {
    const anyT = t as unknown as {
      _id?: string | number;
      id?: string | number;
      taskId?: string | number;
      task?: { _id?: string | number };
    };

    const id =
      anyT._id ??
      anyT.task?._id ??
      anyT.id ??
      anyT.taskId ?? // last resort only
      "";

    return String(id);
  };

  /* ================= LOAD COLUMNS ================= */
  const loadColumns = async (pid: string) => {
    try {
      setError("");
      setLoading(true);

      const cols = await getProjectColumnsApi(pid);

      console.log("RAW cols from API:", cols);
      console.log("FIRST TASK SAMPLE:", (cols as unknown as any)?.[0]?.tasks?.[0]);

      const formatted: UIColumn[] = (cols || []).map((col: Column) => {
        const rawTasks: Task[] = Array.isArray((col as unknown as any).tasks)
          ? (((col as unknown as any).tasks as Task[]) ?? [])
          : [];

        // ✅ Normalize tasks: do NOT overwrite with taskId.
        const normalizedTasks: Task[] = rawTasks.map((t) => {
          const anyT = t as unknown as {
            _id?: string | number;
            id?: string | number;
            taskId?: string | number;
            task?: { _id?: string | number };
          };

          const realMongoId = anyT._id ?? anyT.task?._id ?? anyT.id ?? "";
          return { ...(t as object), _id: String(realMongoId) } as Task;
        });

        const title = ((col as unknown as any).name || col.title || "Untitled") as string;
        return {
          _id: col._id,
          title,
          key: title.toLowerCase().replace(/\s/g, ""),
          order: (col as unknown as any).order ?? 0,
          tasks: normalizedTasks,
        };
      });

      formatted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setColumns(formatted.length ? formatted : makeDefaultColumns());
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to load columns.");
      setColumns(makeDefaultColumns());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    void loadColumns(projectId);
  }, [projectId]);

  /* ================= CLOSE MENU ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!menu) return;
      const target = e.target as Node;
      const inMenu = !!menuRef.current?.contains(target);
      if (!inMenu) setMenu(null);
    };

    const onWindowResize = () => {
      if (menu) setMenu(null);
    };

    const onWindowScroll = () => {
      if (menu) setMenu(null);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("scroll", onWindowScroll, true);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", onWindowScroll, true);
    };
  }, [menu]);

  /* ================= FILTER TASKS ================= */
  const filteredColumns = useMemo(() => {
    if (!columns.length) return columns;

    return columns.map((col) => {
      const filteredTasks = (col.tasks || []).filter((task) => {
        if (filters.search.trim()) {
          const q = filters.search.trim();
          const t = String(task.title || "");
          const match = filters.exactMatch
            ? t === q
            : t.toLowerCase().includes(q.toLowerCase());
          if (!match) return false;
        }

        const anyTask = task as Task;

        if (filters.assignedToMe && (anyTask as unknown as any).assignee?.id !== "ajay")
          return false;

        if (
          filters.assignees.length > 0 &&
          !filters.assignees.includes((anyTask as unknown as any).assignee?.id)
        )
          return false;

        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(String(anyTask.priority))
        )
          return false;

        if (
          filters.completed !== null &&
          (anyTask as unknown as any).completed !== filters.completed
        )
          return false;

        if (filters.createdByMe && (anyTask as unknown as any).createdBy?.id !== "ajay")
          return false;

        if (filters.favorites && !(anyTask as unknown as any).isFavorite) return false;
        if (filters.followed && !(anyTask as unknown as any).isFollowed) return false;

        return true;
      });

      return { ...col, tasks: filteredTasks };
    });
  }, [columns, filters]);

  const displayColumns = filteredColumns.length ? filteredColumns : makeDefaultColumns();

  const handleApplyFilters = (newFilters: Filters) => setFilters(newFilters);
  const clearAllFilters = () => setFilters(defaultFilters);

  /* ================= ADD COLUMN ================= */
  const handleAddColumn = async () => {
    const name = newColumnName.trim();
    if (!name || !projectId) return;

    const isDuplicate = columns.some(
      (col) => col.title.trim().toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      alert("Column already exists");
      return;
    }

    try {
      setLoading(true);
      await createColumnApi(projectId, { title: name });
      setNewColumnName("");
      setShowAddInput(false);
      await loadColumns(projectId);
    } catch (e: unknown) {
      console.error("Create column error:", e);
      alert(e instanceof Error ? e.message : "Failed to create column");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD TASK ================= */
  const handleAddTask = async (payload: {
  title: string;
  description?: string;
  priority?: string;
  projectId: string;
  columnId: string;
}) => {
  if (!projectId) return;

  try {
    setLoading(true);
    setError("");
    
    console.log("Adding task with payload:", payload);
    
    const result = await createTaskApi({
      title: payload.title,
      description: payload.description,
      priority: payload.priority || "Medium",
      projectId: payload.projectId,
      columnId: payload.columnId,
    });
    
    console.log("Task created successfully:", result);

    setShowAddTask(false);
    setActiveColumnId(null);
    
    // Reload columns to see the new task
    await loadColumns(projectId);
  } catch (e: unknown) {
    console.error("Failed to create task:", e);
    const errorMessage = e instanceof Error ? e.message : "Failed to create task.";
    setError(errorMessage);
    alert(errorMessage); // Show alert so user knows it failed
  } finally {
    setLoading(false);
  }
};

  /* ================= UPDATE TASK ================= */
  const handleUpdateTask = async (
  taskId: string,
  columnId: string,
  updates: Partial<Task>
) => {
  if (!projectId) return;

  try {
    setLoading(true);
    setError("");

    console.log("handleUpdateTask => PATCH", { projectId, taskId, columnId, updates });

    // Only send the fields that are actually being updated
    // Don't send columnId in the body
    await updateTaskApi(projectId, taskId, {
      title: typeof updates.title === "string" ? updates.title : undefined,
      description: typeof updates.description === "string" ? updates.description : undefined,
      priority: typeof updates.priority === "string" ? updates.priority : undefined,
      // Remove columnId from here
    });

    await loadColumns(projectId);
    setEditDraft(null);
    setMenu(null);
  } catch (e: unknown) {
    console.error("Update task error:", e);
    setError(e instanceof Error ? e.message : "Failed to update task.");
  } finally {
    setLoading(false);
  }
};

  /* ================= DELETE TASK ================= */
  const handleDeleteTask = async (taskId: string, columnId: string) => {
    if (!projectId) return;

    const ok = window.confirm("Are you sure you want to delete this task?");
    if (!ok) return;

    try {
      setLoading(true);
      console.log("Delete task requested:", { projectId, taskId, columnId });

      // TODO: call delete API when backend endpoint is ready.
      await loadColumns(projectId);
      setMenu(null);
    } catch (e: unknown) {
      console.error("Delete task error:", e);
      setError(e instanceof Error ? e.message : "Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MENU OPEN ================= */
  const openTaskMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    columnId: string,
    task: Task
  ) => {
    e.stopPropagation();

    const taskId = getTaskId(task);
    if (!taskId) return;

    if (menu?.taskId === taskId) {
      setMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const preferX = rect.right - MENU_WIDTH;
    const clampedX = Math.max(8, Math.min(preferX, viewportW - MENU_WIDTH - 8));

    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;

    const openDown = spaceBelow >= MENU_HEIGHT + MENU_GAP || spaceBelow >= spaceAbove;

    const yDown = rect.bottom + MENU_GAP;
    const yUp = rect.top - MENU_GAP - MENU_HEIGHT;

    const clampedY = openDown
      ? Math.max(8, Math.min(yDown, viewportH - MENU_HEIGHT - 8))
      : Math.max(8, Math.min(yUp, viewportH - MENU_HEIGHT - 8));

    setMenu({
      taskId,
      columnId,
      task,
      x: clampedX,
      y: clampedY,
    });
  };

  /* ================= EDIT HANDLERS ================= */
  const onEditClick = (colId: string, task: Task) => {
    const taskId = getTaskId(task);
    if (!taskId) return;

    setMenu(null);
    setEditDraft({
      taskId,
      columnId: colId,
      title: task.title || "",
      description: String(task.description || ""),
      priority: String(task.priority || "Medium"),
    });
  };

  const onDeleteClick = (colId: string, task: Task) => {
    const taskId = getTaskId(task);
    if (!taskId) return;

    setMenu(null);
    void handleDeleteTask(taskId, colId);
  };

  const saveEditLocal = () => {
    if (!editDraft || !projectId) return;

    const { taskId, columnId, title, description, priority } = editDraft;

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    void handleUpdateTask(taskId, columnId, {
      title: title.trim(),
      description: description || undefined,
      priority,
    } as Partial<Task>);
  };

  return (
    <div className="project-board">
      <div className="project-board-header">
        <div>
          <h1>{project?.title || "Project Board"}</h1>
          <p style={{ marginTop: 4, opacity: 0.7 }}>
            {loading ? "Loading..." : `${columns.length} columns`}
          </p>
        </div>

        <div className="board-actions">
          <button className="filter-btn" type="button" onClick={() => setShowFilters(true)}>
            <span className="icon">☰</span> Filters
          </button>

          <button className="clear-all-filters" type="button" onClick={clearAllFilters}>
            Clear all
          </button>
        </div>
      </div>

      {error && <div className="board-error">{error}</div>}

      <div className="board-body">
        <div className="columns-row">
          {displayColumns.map((col) => (
            <div key={col._id} className="column-card">
              <div className="column-title">
                <span>{col.title}</span>
                <span className="count">{col.tasks?.length || 0}</span>
              </div>

              <div className="tasks-area">
                {(col.tasks?.length || 0) === 0 ? (
                  <div className="no-tasks">No tasks</div>
                ) : (
                  col.tasks.map((t) => {
                    const taskId = getTaskId(t);
                    return (
                      <div
                        key={taskId || `${col._id}-${String(t.title)}`}
                        className="task-item"
                      >
                        <button
                          type="button"
                          aria-label="Task menu"
                          onClick={(e) => openTaskMenu(e, col._id, t)}
                          className="kebab-btn"
                        >
                          ⋮
                        </button>

                        <div className="task-title">{t.title}</div>
                        {t.priority && (
                          <span className={`priority-badge ${String(t.priority).toLowerCase()}`}>
                            {t.priority}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <button
                className="add-task-btn"
                type="button"
                onClick={() => {
                  setActiveColumnId(col._id);
                  setShowAddTask(true);
                }}
              >
                + Add Task
              </button>
            </div>
          ))}

          <div className="add-group-wrapper">
            {showAddInput ? (
              <div className="add-group-input-container">
                <input
                  className="add-group-input"
                  placeholder="Enter group name..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleAddColumn();
                  }}
                  autoFocus
                />
                <div className="add-group-actions">
                  <button
                    className="add-group-btn"
                    onClick={() => void handleAddColumn()}
                    disabled={loading}
                  >
                    Add group
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddInput(false);
                      setNewColumnName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button className="add-group-column" onClick={() => setShowAddInput(true)}>
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task Menu */}
      {menu &&
        createPortal(
          <div
            ref={menuRef}
            className="task-menu"
            style={{
              position: "fixed",
              left: menu.x,
              top: menu.y,
              width: MENU_WIDTH,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onEditClick(menu.columnId, menu.task)}
              className="task-menu-item"
            >
              <span className="menu-icon">✎</span> Edit
            </button>
            <div className="menu-divider" />
            <button
              type="button"
              onClick={() => onDeleteClick(menu.columnId, menu.task)}
              className="task-menu-item danger"
            >
              <span className="menu-icon">🗑️</span> Delete
            </button>
          </div>,
          document.body
        )}

      {/* Filter Panel */}
      {projectId && (
        <FilterPanel
          projectId={projectId}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          currentFilters={filters}
        />
      )}

      {/* Add Task Modal */}
      {showAddTask && activeColumnId && projectId && (
        <AddTaskModal
          columnTitle={columns.find((c) => c._id === activeColumnId)?.title || ""}
          projectId={projectId}
          columnId={activeColumnId}
          onClose={() => {
            setShowAddTask(false);
            setActiveColumnId(null);
          }}
          onAdd={handleAddTask}
        />
      )}

      {/* Edit modal */}
      {editDraft && (
        <div className="edit-overlay" onClick={() => setEditDraft(null)}>
          <div className="edit-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-head">
              <h3>Edit Task</h3>
              <p>Update title, description and priority</p>
            </div>

            <div className="edit-form">
              <div className="edit-field">
                <label>Title</label>
                <input
                  className="edit-input"
                  value={editDraft.title}
                  onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>

              <div className="edit-field">
                <label>Description</label>
                <textarea
                  className="edit-textarea"
                  value={editDraft.description}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              <div className="edit-field">
                <label>Priority</label>
                <select
                  className="edit-select"
                  value={editDraft.priority}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="edit-actions">
              <button
                type="button"
                className="edit-btn edit-btn-ghost"
                onClick={() => setEditDraft(null)}
              >
                Cancel
              </button>
              <button type="button" className="edit-btn edit-btn-primary" onClick={saveEditLocal}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
