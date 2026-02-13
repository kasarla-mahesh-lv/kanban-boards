import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  // getProjectColumnsApi,
  // getProjectsApi,
  type Column,
  type Project,
} from "../Api/ApiService";
import { getProjectColumnsApi } from "../Api/ApiCommon"
import "./Project.css"; 




const DEFAULT_COLUMNS = ["Backlog", "Todo", "In Progress", "Done"];

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams<{projectId:string}>();
  const [project] = useState<Project | null>(null);
  


  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
   const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creating, ] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    console.log(projectId,"project");
    
    (async () => {
      try {
        setError("");
        setLoading(true);

        // const projects = await getProjectsApi();
        // setProject(projects.find((p) => p._id === projectId) || null);

        const cols = await getProjectColumnsApi(projectId);
        console.log("Columns loaded:", cols);
        setColumns(cols);
      } catch (e: any) {
        console.log("Load board failed:",e, e?.response?.status, e?.response?.data);
        setError("Failed to load columns.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const [showFilters, setShowFilters] = useState(false);


  const displayColumns = columns.length
    ? columns
    : DEFAULT_COLUMNS.map((t, idx) => ({
        _id: `temp-${idx}`,
        title: t,
        key: t.toLowerCase().replace(/\s/g, ""),
        tasks: [],
      }));

 
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
                col.tasks.map((t: any) => (
                  <div key={t._id || t.id} className="task-item">
                    {t.title}
                  </div>
                ))
              )}
            </div>

            <button className="add-task-btn">+ Add Task</button>
          </div>
        ))}
        <div className="add-group-wrapper">
  {!showAddGroup ? (
    <div
      className="add-group-column"
      onClick={() => setShowAddGroup(true)}
    >
      Add group
    </div>
  ) : (
    <div className="add-group-input-container">
      <input
        type="text"
        placeholder="Enter group name..."
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="add-group-input"
        autoFocus
      />

      <div className="add-group-actions">
        <button
          className="add-group-btn"
          onClick={() => {
            console.log("Create group:", groupName);
            setShowAddGroup(false);
            setGroupName("");
          }}
          disabled={creating}
        >
          Add group
        </button>

        <button
          className="cancel-btn"
          onClick={() => {
            setShowAddGroup(false);
            setGroupName("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

      </div>

      {/* 🔥 FILTER SIDEBAR */}
      <div className={`filter-panel ${showFilters ? "open" : ""}`}>
        <div className="filter-header">
          <h3>Filter</h3>
          <button onClick={() => setShowFilters(false)}>→</button>
        </div>

        <div className="filter-content">
          <input type="text" placeholder="Search" className="filter-search" />

          <div className="filter-section">
            <h4>Due date</h4>
            <label><input type="checkbox" /> No dates</label>
            <label><input type="checkbox" /> Overdue</label>
            <label><input type="checkbox" /> Due tomorrow</label>
            <label><input type="checkbox" /> Due next week</label>
          </div>

          <div className="filter-section">
            <h4>Priority</h4>
            <label><input type="checkbox" /> Low priority</label>
            <label><input type="checkbox" /> Medium priority</label>
            <label><input type="checkbox" /> High priority</label>
          </div>

          <div className="filter-section">
            <h4>Misc</h4>
            <label><input type="checkbox" /> Marked as complete</label>
            <label><input type="checkbox" /> Not marked as complete</label>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  
};

export default ProjectBoard;
