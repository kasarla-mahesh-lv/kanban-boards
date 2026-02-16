
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import FilterPanel from "./FilterPanel";
import AddTaskModal from "./AddTaskModal";
import "./Project.css";

import {
  getProjectColumnsApi,
  createTaskApi, // ✅ add this in ApiCommon.ts
} from "../Api/ApiCommon";

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

// UI column type
type UIColumn = {
  _id: string;
  title: string;
  key: string;
  order?: number;
  tasks: any[];
};

const makeDefaultColumns = (): UIColumn[] =>
  DEFAULT_COLUMNS.map((t, idx) => ({
    _id: `temp-${idx}`,
    title: t,
    key: t.toLowerCase().replace(/\s/g, ""),
    order: idx,
    tasks: [],
  }));

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams();

  const [project] = useState<any>({ title: "Project Board" });

  const [columns, setColumns] = useState<UIColumn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const [showAddTask, setShowAddTask] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  /* ================= LOAD COLUMNS FROM API ================= */
  const loadColumns = async () => {
    if (!projectId) return;

    try {
      setError("");
      setLoading(true);

      const cols: any[] = await getProjectColumnsApi(projectId);

      // ✅ backend response shape convert -> UIColumn
      const formatted: UIColumn[] = (cols || []).map((col: any) => ({
        _id: col._id,
        title: col.name || col.title || "Untitled",
        key: (col.name || col.title || "")
          .toLowerCase()
          .replace(/\s/g, ""),
        order: col.order ?? 0,
        tasks: col.tasks || [],
      }));

      formatted.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setColumns(formatted.length ? formatted : makeDefaultColumns());
    } catch (e: any) {
      console.log(e);
      setError(e?.message || "Failed to load columns.");
      setColumns(makeDefaultColumns());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  /* ================= FILTER TASKS ================= */
  const filteredColumns = useMemo(() => {
    if (!columns.length) return columns;

    return columns.map((col: any) => {
      const filteredTasks = (col.tasks || []).filter((task: any) => {
        // Search
        if (filters.search) {
          const t = (task.title || "").toString();
          const match = filters.exactMatch
            ? t === filters.search
            : t.toLowerCase().includes(filters.search.toLowerCase());
          if (!match) return false;
        }

        // Priority
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority)
        )
          return false;

        // Completed
        if (filters.completed !== null && task.completed !== filters.completed)
          return false;

        // Favorites
        if (filters.favorites && !task.isFavorite) return false;

        // Followed
        if (filters.followed && !task.isFollowed) return false;

        return true;
      });

      return { ...col, tasks: filteredTasks };
    });
  }, [columns, filters]);

  const displayColumns = filteredColumns.length ? filteredColumns : columns;

  const handleApplyFilters = (newFilters: Filters) => setFilters(newFilters);
  const clearAllFilters = () => setFilters(defaultFilters);

  const hasActiveFilters = useMemo(() => {
    if (filters.search.trim()) return true;
    if (filters.assignedToMe) return true;
    if (filters.assignees.length) return true;
    if (filters.priority.length) return true;
    if (filters.completed !== null) return true;
    if (filters.createdByMe) return true;
    if (filters.favorites) return true;
    if (filters.followed) return true;
    if (filters.exactMatch) return true;
    if (filters.dueDateOptions.length) return true;
    if (filters.types.length) return true;
    if (filters.milestones.length) return true;
    if (filters.noBlockers) return true;
    if (filters.selectedBlockers.length) return true;
    if (filters.noBlocking) return true;
    if (filters.selectedBlocking.length) return true;
    if (filters.selectCreators.length) return true;
    return false;
  }, [filters]);

  /* ================= ✅ ADD TASK (API HIT) ================= */
  const handleAddTask = async (payload: {
    title: string;
    description?: string;
    priority?: string;
    projectId: string;
    columnId: string;
  }) => {
    if (!projectId) return;

    // ✅ API HIT
    await createTaskApi({
      title: payload.title,
      description: payload.description,
      priority: payload.priority || "Medium",
      projectId: payload.projectId,
      columnId: payload.columnId,
    });

    // ✅ reload board from backend (so it will always show saved task)
    await loadColumns();
  };

  return (
    <div className="project-board">
      <div className="project-board-header">
        <div>
          <h1>{project?.title || "Project Board"}</h1>
          <p style={{ marginTop: 4, opacity: 0.7 }}>
            {loading ? "Loading..." : "Project Board"}
          </p>
        </div>

        <div className="board-actions">
          <button className="add-col-btn">+ Add Column</button>

          <button className="filter-btn" onClick={() => setShowFilters(true)}>
            <span className="icon">☰</span> Filters
            {hasActiveFilters && (
              <span className="filter-active-indicator">●</span>
            )}
          </button>
        </div>
      </div>

      {error && <div className="board-error">{error}</div>}

      <div className="board-body">
        <div className="columns-row">
          {displayColumns.map((col: any) => (
            <div key={col._id} className="column-card">
              <div className="column-title">
                <span>{col.title}</span>
                <span className="count">{col.tasks?.length || 0}</span>
              </div>

              <div className="tasks-area">
                {(col.tasks?.length || 0) === 0 ? (
                  <div className="no-tasks">No tasks</div>
                ) : (
                  col.tasks.map((t: any) => (
                    <div key={t._id || t.id} className="task-item">
                      <div className="task-title">{t.title}</div>

                      {t.description && (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 12,
                            color: "#64748b",
                          }}
                        >
                          {t.description}
                        </div>
                      )}

                      {t.priority && (
                        <span
                          className={`priority-badge ${String(
                            t.priority
                          ).toLowerCase()}`}
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

      {projectId && (
        <FilterPanel
          projectId={projectId}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          currentFilters={filters}
        />
      )}

      {showAddTask && activeColumnId && projectId && (
        <AddTaskModal
          columnTitle={
            columns.find((c: any) => c._id === activeColumnId)?.title || ""
          }
          projectId={projectId}
          columnId={activeColumnId}
          onClose={() => {
            setShowAddTask(false);
            setActiveColumnId(null);
          }}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
};

export default ProjectBoard;

