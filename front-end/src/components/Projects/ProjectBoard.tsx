import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";
import AddTaskModal from "./AddTaskModal";
import {
  type Column,
  type Project,
  getProjectColumnsApi,
  createTaskApi
} from "../Api/ApiCommon";
import FilterPanel from "./FilterPanel";
import ProjectSettings from "./ProjectSettings"; // Import the new Settings component
import "./Project.css"; 
import TaskDeatils from "./TaskDetail"; // ✅ Import our new panel


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

type Task = {
  _id?: string;
  id?: string;
  title: string;
  priority?: string;
  description?: string;
  completed?: boolean;
  assignee?: { id?: string };
  createdBy?: { id?: string };
  isFavorite?: boolean;
  isFollowed?: boolean;
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
  x: number; // fixed-left
  y: number; // fixed-top
};

const MENU_WIDTH = 180;
const MENU_HEIGHT = 92; // ~2 rows (Edit + Delete + divider)
const MENU_GAP = 8;

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project] = useState<Project | null>(null);

  const [columns, setColumns] = useState<UIColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // ✅ New state for task details

  // Add Task modal
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  // ✅ Portal menu state
  const [menu, setMenu] = useState<TaskMenuState | null>(null);

  // Edit modal (UI-only)
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ================= LOAD COLUMNS ================= */
  const loadColumns = async (pid: string) => {
    try {
      setError("");
      setLoading(true);

      const cols = await getProjectColumnsApi(pid);

      const formatted: UIColumn[] = (cols || []).map((col: any) => ({
        _id: col._id,
        title: col.name || col.title || "Untitled",
        key: (col.name || col.title || "untitled").toLowerCase().replace(/\s/g, ""),
        order: col.order ?? 0,
        tasks: Array.isArray(col.tasks) ? col.tasks : [],
      }));

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
  //  const [selectedTask, setSelectedTask] = useState<any | null>(null); // ✅ New state for task details
  });

  useEffect(() => {
    if (!projectId) return;

    (async () => {
      try {
        setLoading(true);
        const cols = await getProjectColumnsApi(projectId);

        const formattedColumns = cols.map((col: any) => ({
          _id: col._id,
          title: col.name,
          key: col.name.toLowerCase().replace(/\s/g, ""),
          order: col.order,
          tasks: col.tasks || [],
        }));

        // Sort by order
        formattedColumns.sort((a, b) => a.order - b.order);

        setColumns(formattedColumns);
      } catch (e) {
        console.error(e);
        setError("Failed to load columns.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  /* ================= CLOSE MENU ON OUTSIDE CLICK / SCROLL / RESIZE ================= */
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!menu) return;

      const target = e.target as Node;
      const inMenu = !!menuRef.current?.contains(target);

      // If clicked outside the menu, close
      if (!inMenu) setMenu(null);
    };

    const onWindowResize = () => {
      if (menu) setMenu(null);
    };

    const onWindowScroll = () => {
      // scroll anywhere -> close (prevents wrong positioning)
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
      const filteredTasks = (col.tasks || []).filter((task: any) => {
        if (filters.search.trim()) {
          const q = filters.search.trim();
          const t = (task.title || "").toString();
          const match = filters.exactMatch ? t === q : t.toLowerCase().includes(q.toLowerCase());
          if (!match) return false;
        }

        if (filters.assignedToMe && task.assignee?.id !== "ajay") return false;
        if (filters.assignees.length > 0 && !filters.assignees.includes(task.assignee?.id)) return false;
        if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
        if (filters.completed !== null && task.completed !== filters.completed) return false;
        if (filters.createdByMe && task.createdBy?.id !== "ajay") return false;
        if (filters.favorites && !task.isFavorite) return false;
        if (filters.followed && !task.isFollowed) return false;

        return true;
      });
      return { ...col, tasks: filteredTasks };
    });
  }, [columns, filters]);

  const displayColumns = filteredColumns.length ? filteredColumns : makeDefaultColumns();

  const handleApplyFilters = (newFilters: Filters) => setFilters(newFilters);
  const clearAllFilters = () => setFilters(defaultFilters);

  const handleSettingsClick = () => setShowSettings(true);
  const handleCloseSettings = () => setShowSettings(false);

  /* ================= ADD TASK (API HIT) ================= */
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
      await createTaskApi({
        title: payload.title,
        description: payload.description,
        priority: payload.priority || "Medium",
        projectId: payload.projectId,
        columnId: payload.columnId,
      });

      setShowAddTask(false);
      setActiveColumnId(null);

      await loadColumns(projectId);
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= MENU OPEN (PORTAL + CLAMP) ================= */
  const openTaskMenu = (e: React.MouseEvent<HTMLButtonElement>, columnId: string, task: Task) => {
    e.stopPropagation();

    const taskId = String(task._id || task.id || "");
    if (!taskId) return;

    // toggle same menu
    if (menu?.taskId === taskId) {
      setMenu(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    // prefer open down, if not enough space then up
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const preferX = rect.right - MENU_WIDTH; // align right edges
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

  /* ================= EDIT / DELETE (UI ONLY) ================= */
  const onEditClick = (colId: string, task: Task) => {
    const taskId = String(task._id || task.id || "");
    if (!taskId) return;

    setMenu(null);
    setEditDraft({
      taskId,
      columnId: colId,
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
    });
  };

  const onDeleteClick = (colId: string, task: Task) => {
    const taskId = String(task._id || task.id || "");
    if (!taskId) return;

    setMenu(null);

    const ok = window.confirm("Delete this task?");
    if (!ok) return;

    setColumns((prev) =>
      prev.map((c) =>
        c._id !== colId ? c : { ...c, tasks: (c.tasks || []).filter((t) => String(t._id || t.id) !== taskId) }
      )
    );
  };

  const saveEditLocal = () => {
    if (!editDraft) return;

    const { columnId, taskId, title, description, priority } = editDraft;

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    setColumns((prev) =>
      prev.map((c) => {
        if (c._id !== columnId) return c;
        return {
          ...c,
          tasks: (c.tasks || []).map((t) => {
            const id = String(t._id || t.id || "");
            if (id !== taskId) return t;
            return { ...t, title: title.trim(), description, priority };
          }),
        };
      })
    );

    setEditDraft(null);
  };

  return (
    <div className="project-board">
      <div className="project-board-header">
        <div>
          <h1>{project?.title || "Project Board"}</h1>
          <p style={{ marginTop: 4, opacity: 0.7 }}>{loading ? "Loading..." : "Project Board"}</p>
        </div>

        <div className="board-actions">
          <button className="add-col-btn" type="button">
            + Add Column
          </button>

          <button className="settings-btn" type="button" onClick={handleSettingsClick} title="Project Settings">
            <span className="icon">⚙️</span> Settings
          </button>

          <button className="filter-btn" type="button" onClick={() => setShowFilters(true)}>
            <span className="icon">☰</span> Filters
            {Object.keys(filters).some(key => 
              key !== 'search' && 
              Array.isArray(filters[key as keyof Filters]) 
                ? (filters[key as keyof Filters] as any[]).length > 0
                : filters[key as keyof Filters] && key !== 'dueDateRange' && key !== 'creationDate'
            ) && (
              <span className="filter-active-indicator">●</span>
            )}
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
                {col.tasks.length === 0 ? (
                  <div className="no-tasks">No tasks</div>
                ) : (
                  col.tasks.map((t: any) => (
                    <div
                      key={t._id}
                      className="task-item"
                      onClick={() => setSelectedTask(t)} // ✅ Show details
                    >
                      <div className="task-title">{t.title}</div>
                      {t.priority && (
                        <span
                          className={`priority-badge ${t.priority.toLowerCase()}`}
                        >
                          {t.priority}
                        </span>
                      )}
                    </div>
                  ))
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
        </div>
      </div>

      {/* ✅ PORTAL MENU (always visible, no overlap/clipping) */}
      {menu &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: menu.x,
              top: menu.y,
              width: MENU_WIDTH,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(0,0,0,0.14)",
              overflow: "hidden",
              zIndex: 100000,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onEditClick(menu.columnId, menu.task)}
              style={menuBtn}
            >
              Edit
            </button>
            <div style={{ height: 1, background: "#f1f5f9" }} />
            <button
              type="button"
              onClick={() => onDeleteClick(menu.columnId, menu.task)}
              style={{ ...menuBtn, color: "#dc2626" }}
            >
              Delete
            </button>
          </div>,
          document.body
        )}

      {/* Filter Panel */}
      {/* {projectId && (
        <FilterPanel
          projectId={projectId}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={(f) => setFilters(f)}
          currentFilters={filters}
        />
      )}  */}

      <div className="panel-stack">
  {showFilters && projectId && (
    <FilterPanel
      projectId={projectId}
      isOpen={true}
      onClose={() => setShowFilters(false)}
      onApply={(f) => setFilters(f)}
      currentFilters={filters}
    />
  )}

  {selectedTask && projectId && (
    <TaskDeatils
      taskTitle={selectedTask.title}
      projectId={projectId}
      onClose={() => setSelectedTask(null)}
    />
  )}
</div>



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

      {/* Edit modal (UI-only) */}
      {/* Edit modal (UI-only) */}
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
            onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })}
            rows={3}
            placeholder="Enter description"
          />
        </div>

        <div className="edit-field">
          <label>Priority</label>
          <select
            className="edit-select"
            value={editDraft.priority}
            onChange={(e) => setEditDraft({ ...editDraft, priority: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="edit-actions">
        <button type="button" className="edit-btn edit-btn-ghost" onClick={() => setEditDraft(null)}>
          Cancel
        </button>
        <button type="button" className="edit-btn edit-btn-primary" onClick={saveEditLocal}>
          Save
        </button>
      </div>
    </div>
  </div>
)}


      {/* Settings */}
      <ProjectSettings projectId={projectId} isOpen={showSettings} onClose={handleCloseSettings} />
    </div>
  );
};

const menuBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  textAlign: "left",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
};

export default ProjectBoard;
