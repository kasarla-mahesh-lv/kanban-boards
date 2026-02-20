import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { type Project, getProjectColumnsApi, createTaskApi,createColumnApi } from "../Api/ApiCommon";
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
 
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  // Add Column (Group) state
const [showAddInput, setShowAddInput] = useState(false);
const [newColumnName, setNewColumnName] = useState("");


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
//   const handleAddColumn = () => {
//   if (!newColumnName.trim()) return;

//   const newColumn: UIColumn = {
//     _id: `temp-${Date.now()}`,
//     title: newColumnName.trim(),
//     key: newColumnName.toLowerCase().replace(/\s/g, ""),
//     order: columns.length,
//     tasks: [],
//   };

//   setColumns((prev) => [...prev, newColumn]);
//   setNewColumnName("");
//   setShowAddInput(false);
// };
const handleAddColumn = async () => {
  const name = newColumnName.trim();

  if (!name || !projectId) return;

  // Duplicate check (case insensitive)
  const isDuplicate = columns.some(
    (col) => col.title.trim().toLowerCase() === name.toLowerCase()
  );

  if (isDuplicate) {
    alert("Column already exists");
    return;
  }

  try {
    setLoading(true);

    // ✅ Correct backend call
    await createColumnApi(projectId, { title : name });

    setNewColumnName("");
    setShowAddInput(false);

    // ✅ Reload columns
    await loadColumns(projectId);

  } catch (error: any) {
    console.error("Create column error:", error);
    alert(error?.message || "Failed to create column");
  } finally {
    setLoading(false);
  }
};






  return (
    <div className="project-board">
      <div className="project-board-header">
        <div>
          <h1>{project?.title || "Project Board"}</h1>
          <p style={{ marginTop: 4, opacity: 0.7 }}>{loading ? "Loading..." : "Project Board"}</p>
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
          <span>{col.tasks?.length || 0}</span> 
        </div>

      <div className="tasks-area">
        {(col.tasks?.length || 0) === 0 ? (
          <div className="no-tasks">No tasks</div>
        ) : (
          col.tasks.map((t: any) => (
            <div key={t._id || t.id} className="task-item">
              <div className="task-title">{t.title}</div>
              {t.priority && (
                <span className="priority-badge">
                  {t.priority}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <button className="add-task-btn">
        + Add Task
      </button>
    </div>
  ))}

  {/* ✅ VAIZ STYLE ADD GROUP */}
  <div className="add-group-wrapper">
  {showAddInput ? (
    <div className="add-group-input-container">
      <input
        className="add-group-input"
        placeholder="Enter group name..."
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddColumn();
        }}
        autoFocus
      />

      <div className="add-group-actions">
        <button
          className="add-group-btn"
          onClick={handleAddColumn}
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
    <button
      className="add-group-column"
      onClick={() => setShowAddInput(true)}
    >
      +
    </button>
  )}
</div>


    

      </div>
</div>
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


    
    </div>
  );
};



export default ProjectBoard;