
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  type Column,
  type Project,
  getProjectColumnsApi,
} from "../Api/ApiCommon";

import FilterPanel from "./FilterPanel";
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

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const currentUserId = "ajay"; // Later replace with auth user

  //const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  /* ================= LOAD COLUMNS ================= */
  useEffect(() => {
  if (!projectId) return;

  (async () => {
    try {
      setLoading(true);
      const cols = await getProjectColumnsApi(projectId);

      console.log(cols, "----------------");

      // 🔥 Transform API response to match UI structure
      const formattedColumns = cols.map((col: any) => ({
        _id: col._id,
        title: col.name,          // map name -> title
        key: col.name.toLowerCase().replace(/\s/g, ""),
        order: col.order,
        tasks: col.tasks || [],   // ensure tasks array exists
      }));

      // Optional: sort by order
      formattedColumns.sort((a, b) => a.order - b.order);

      setColumns(formattedColumns);
    } catch (e) {
      console.log(e, "===============");
      setError("Failed to load columns.");
    } finally {
      setLoading(false);
    }
  })();
}, [projectId]);


  // ✅ Active filter check (safe)
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) =>
      Array.isArray(value)
        ? value.length > 0
        : value !== null && value !== false && value !== ""
    );
  }, [filters]);

  // ✅ Safe filtering
  const filteredColumns = useMemo(() => {
    return columns.map((col) => {
      const filteredTasks = (col.tasks || []).filter((task: any) => {
        const title = (task.title || "").toLowerCase();

        // Search
        if (filters.search) {
          const search = filters.search.toLowerCase();
          const match = filters.exactMatch
            ? title === search
            : title.includes(search);
          if (!match) return false;
        }

        // Assigned to me
        if (
          filters.assignedToMe &&
          task.assignee?.id !== currentUserId
        )
          return false;

        // Assignees
        if (
          filters.assignees.length > 0 &&
          !filters.assignees.includes(task.assignee?.id)
        )
          return false;

        // Priority
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority)
        )
          return false;

        // Completed
        if (
          filters.completed !== null &&
          task.completed !== filters.completed
        )
          return false;

        // Created by me
        if (
          filters.createdByMe &&
          task.createdBy?.id !== currentUserId
        )
          return false;

        // Favorites
        if (filters.favorites && !task.isFavorite) return false;

        // Followed
        if (filters.followed && !task.isFollowed) return false;

        return true;
      });

      return { ...col, tasks: filteredTasks };
    });
  }, [columns, filters, currentUserId]);

  const displayColumns =
    filteredColumns.length > 0
      ? filteredColumns
      : DEFAULT_COLUMNS.map((title, idx) => ({
          _id: `temp-${idx}`,
          title,
          key: title.toLowerCase().replace(/\s/g, ""),
          tasks: [],
        }));

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
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

          <button
            className="filter-btn"
            onClick={() => setShowFilters(true)}
          >
            ☰ Filters
            {hasActiveFilters && (
              <span className="filter-active-indicator">●</span>
            )}
          </button>
        </div>
      </div>

      {error && <div className="board-error">{error}</div>}

      {hasActiveFilters && (
        <div className="active-filters-bar">
          <span>Active filters:</span>
          <button onClick={clearAllFilters}>Clear all</button>
        </div>
      )}

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
                    <div
                      key={t._id || t.id}
                      className="task-item"
                    >
                      <div className="task-title">
                        {t.title}
                      </div>
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
    </div>
  );
};

export default ProjectBoard;
