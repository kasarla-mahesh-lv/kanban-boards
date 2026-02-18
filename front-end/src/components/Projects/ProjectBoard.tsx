import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  type Column,
  type Project,
  getProjectColumnsApi
} from "../Api/ApiCommon";

import FilterPanel from "./FilterPanel";
import ProjectSettings from "./ProjectSettings"; // Import the new Settings component
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
  const { projectId } = useParams();
  const [project] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  /* ================= LOAD COLUMNS ================= */
  useEffect(() => {
    if (!projectId) return;

    (async () => {
      try {
        setLoading(true);
        const cols = await getProjectColumnsApi(projectId);

        // Transform API response to match UI structure
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

  // Filter tasks based on current filters
  const filteredColumns = React.useMemo(() => {
    if (!columns.length) return columns;
    
    return columns.map((col) => {
      const filteredTasks = (col.tasks || []).filter((task: any) => {
        // Search filter
        if (filters.search) {
          const match = filters.exactMatch
            ? task.title === filters.search
            : task.title.toLowerCase().includes(filters.search.toLowerCase());
          if (!match) return false;
        }

        // Assigned to me
        if (filters.assignedToMe && task.assignee?.id !== "ajay") return false;

        // Assignees
        if (filters.assignees.length > 0 && 
            !filters.assignees.includes(task.assignee?.id)) return false;

        // Priority
        if (filters.priority.length > 0 && 
            !filters.priority.includes(task.priority)) return false;

        // Completed
        if (filters.completed !== null && 
            task.completed !== filters.completed) return false;

        // Created by me
        if (filters.createdByMe && task.createdBy?.id !== "ajay") return false;

        // Favorites
        if (filters.favorites && !task.isFavorite) return false;

        // Followed
        if (filters.followed && !task.isFollowed) return false;

        return true;
      });

      return { ...col, tasks: filteredTasks };
    });
  }, [columns, filters]);

  const displayColumns = filteredColumns.length
    ? filteredColumns
    : DEFAULT_COLUMNS.map((t, idx) => ({
        _id: `temp-${idx}`,
        title: t,
        key: t.toLowerCase().replace(/\s/g, ""),
        tasks: [],
      }));

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
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
          
          {/* Settings Button */}
          <button
            className="settings-btn"
            onClick={handleSettingsClick}
            title="Project Settings"
          >
            <span className="icon">⚙️</span> Settings
          </button>

          {/* Filter Button */}
          <button
            className="filter-btn"
            onClick={() => setShowFilters(true)}
          >
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

      {/* Active filters summary */}
      {filters !== defaultFilters && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Active filters:</span>
          {filters.priority.length > 0 && (
            <span className="filter-tag">
              Priority: {filters.priority.join(', ')}
              <button onClick={() => setFilters({...filters, priority: []})}>✕</button>
            </span>
          )}
          {filters.assignedToMe && (
            <span className="filter-tag">
              Assigned to me
              <button onClick={() => setFilters({...filters, assignedToMe: false})}>✕</button>
            </span>
          )}
          {filters.completed === true && (
            <span className="filter-tag">
              Completed
              <button onClick={() => setFilters({...filters, completed: null})}>✕</button>
            </span>
          )}
          {filters.completed === false && (
            <span className="filter-tag">
              Not completed
              <button onClick={() => setFilters({...filters, completed: null})}>✕</button>
            </span>
          )}
          <button className="clear-all-filters" onClick={clearAllFilters}>
            Clear all
          </button>
        </div>
      )}

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
                  col.tasks.map((t: any) => (
                    <div key={t._id || t.id} className="task-item">
                      <div className="task-title">{t.title}</div>
                      {t.priority && (
                        <span className={`priority-badge ${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button className="add-task-btn">+ Add Task</button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Panel Component */}
      {projectId && (
        <FilterPanel
          projectId={projectId}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={handleApplyFilters}
          currentFilters={filters}
        />
      )}

      {/* Settings Panel Component - Separate file */}
      <ProjectSettings
        projectId={projectId}
        isOpen={showSettings}
        onClose={handleCloseSettings}
      />
    </div>
  );
};

export default ProjectBoard;