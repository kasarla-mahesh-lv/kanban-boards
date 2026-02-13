
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import {
//   type Column,
//   type Project,
//   type Task,
//   getProjectColumnsApi,
//   createTaskApi,
// } from "../Api/ApiService";
import { type Column, type Project, type Task, createTaskApi, getProjectColumnsApi } from "../Api/ApiCommon";
// import { getProjectColumnsApi, createTaskApi } from "../Api/ApiService";
import AddTaskModal from "./AddTaskModal";
import "./Project.css";

const DEFAULT_COLUMNS = ["Backlog", "Todo", "In Progress", "Done"];

const ProjectBoard: React.FC = () => {
  const { projectId } = useParams();

  const [project] = useState<Project | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  /* ================= LOAD COLUMNS ================= */
  useEffect(() => {
    if (!projectId) return;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const cols = await getProjectColumnsApi(projectId);
        setColumns(cols);
      } catch (e) {
        setError("Failed to load columns.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const [showFilters, setShowFilters] = useState(false);


  /* ================= ADD TASK ================= */
  const handleAddTask = async (
    columnId: string,
    payload: { title: string; description?: string; priority?: string }
  ) => {
    try {
      // 🔥 1. Optimistic UI Update
      const tempTask: Task = {
        title: payload.title,
        description: payload.description,
        projectId: projectId!,
        columnId: columnId,
      };

      setColumns((prev) =>
        prev.map((col) =>
          col._id === columnId
            ? { ...col, tasks: [...(col.tasks || []), tempTask] }
            : col
        )
      );

      console.log(payload,"payload in project board");
      return true;
      
      // 🔥 2. Real API Call
      const createdTask = await createTaskApi(payload);


      console.log(createdTask,"cretedtask");
      
      // 🔥 3. Replace temp with real task
      // setColumns((prev) =>
      //   prev.map((col) =>
      //     col._id === columnId
      //       ? {
      //           ...col,
      //           tasks: col.tasks?.map((t) =>
      //             t._id === tempTask._id ? createdTask : t
      //           ) || [],
      //         }
      //       : col
      //   )
      // );
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Task creation failed");
    }
  };

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
                col.tasks.map((t) => (
                  <div key={t?._id} className="task-item">
                    <strong>{t.title}</strong>
                    {t.description && <p>{t.description}</p>}
                  </div>
                ))
              )}
            </div>

            <button className="add-task-btn">+ Add Task</button>
            <button
              className="add-task-btn"
              onClick={() => setActiveColumn(col)}
            >
              + Add Task
            </button>
          </div>
        ))}
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
      {/* 🔥 Modal */}
      {/* {activeColumn && (
        <AddTaskModal
          columnTitle={activeColumn.title}
          onClose={() => setActiveColumn(null)}
          onAdd={(payload) =>
            handleAddTask(activeColumn._id, payload)
           }
        />
      )} */}
    </div>
  </div>
);

  
};

export default ProjectBoard;












