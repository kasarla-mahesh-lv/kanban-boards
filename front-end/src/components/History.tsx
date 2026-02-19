import React, { useEffect, useMemo, useState } from "react";
import "./History.css";

type HistoryType = "Task" | "Attendance" | "Project" | "System";
type HistoryStatus = "Success" | "Pending" | "Updated" | "Deleted" | "Created" | "Completed";

type HistoryItem = {
  id: number | string;
  title: string;
  description?: string;
  type: HistoryType;
  status: HistoryStatus;
  user: string;
  userId?: string;
  userAvatar?: string;
  time: string; // ISO string from backend
  projectId?: string;
  projectName?: string;
  taskId?: string;
  taskName?: string;
  metadata?: {
    oldValue?: any;
    newValue?: any;
    duration?: number;
    comments?: string;
  };
};

type GroupedHistory = {
  [projectId: string]: {
    projectName: string;
    tasks: {
      [taskId: string]: {
        taskName: string;
        items: HistoryItem[];
      };
    };
    items: HistoryItem[]; // items without task
  };
};

const API_URL = import.meta.env.VITE_API_URL;

const History: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | HistoryType>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | HistoryStatus>("All");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // Fetch history from backend
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/history`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`API failed: ${res.status}`);

      const data: HistoryItem[] = await res.json();
      setItems(data);
      
      // Auto-expand recent projects
      const recentProjects = new Set<string>();
      data.slice(0, 5).forEach(item => {
        if (item.projectId) recentProjects.add(item.projectId);
      });
      setExpandedProjects(recentProjects);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter items based on search, type, status, and date range
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      // Type filter
      const matchesType = typeFilter === "All" ? true : item.type === typeFilter;
      
      // Status filter
      const matchesStatus = statusFilter === "All" ? true : item.status === statusFilter;
      
      // Search filter
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        item.user.toLowerCase().includes(q) ||
        (item.projectName || "").toLowerCase().includes(q) ||
        (item.taskName || "").toLowerCase().includes(q);
      
      // Date range filter
      let matchesDate = true;
      if (dateRange.from) {
        matchesDate = matchesDate && new Date(item.time) >= new Date(dateRange.from);
      }
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(item.time) <= toDate;
      }

      return matchesType && matchesStatus && matchesSearch && matchesDate;
    });
  }, [items, search, typeFilter, statusFilter, dateRange]);

  // Group items by project and task
  const groupedHistory = useMemo(() => {
    const grouped: GroupedHistory = {};

    filteredItems.forEach((item) => {
      const projectId = item.projectId || "no-project";
      const taskId = item.taskId || "no-task";

      // Initialize project
      if (!grouped[projectId]) {
        grouped[projectId] = {
          projectName: item.projectName || "Ungrouped",
          tasks: {},
          items: [],
        };
      }

      // Group by task
      if (item.taskId) {
        if (!grouped[projectId].tasks[taskId]) {
          grouped[projectId].tasks[taskId] = {
            taskName: item.taskName || "Unknown Task",
            items: [],
          };
        }
        grouped[projectId].tasks[taskId].items.push(item);
      } else {
        grouped[projectId].items.push(item);
      }
    });

    return grouped;
  }, [filteredItems]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = filteredItems.length;
    const byType = filteredItems.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byStatus = filteredItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byUser = filteredItems.reduce((acc, item) => {
      acc[item.user] = (acc[item.user] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byType, byStatus, byUser };
  }, [filteredItems]);

  // Toggle functions
  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  // Format time relative
  const formatRelativeTime = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <h1>History Timeline</h1>
        <p>Track all activities across projects and tasks</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-grid">
          {/* Search */}
          <div className="filter-item">
            <input
              type="text"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Type Filter */}
          <div className="filter-item">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="Task">Tasks</option>
              <option value="Attendance">Attendance</option>
              <option value="Project">Projects</option>
              <option value="System">System</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-item">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Updated">Updated</option>
              <option value="Deleted">Deleted</option>
              <option value="Created">Created</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Refresh Button */}
          <div className="filter-item">
            <button
              onClick={fetchHistory}
              className="refresh-btn"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="date-range-grid">
          <div className="filter-item">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="date-input"
              placeholder="From date"
            />
          </div>
          <div className="filter-item">
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="date-input"
              placeholder="To date"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Total Activities</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="stat-icon blue">📊</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Tasks</p>
              <p className="stat-value">{stats.byType.Task || 0}</p>
            </div>
            <div className="stat-icon green">✓</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Projects</p>
              <p className="stat-value">{stats.byType.Project || 0}</p>
            </div>
            <div className="stat-icon purple">📁</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Unique Users</p>
              <p className="stat-value">{Object.keys(stats.byUser).length}</p>
            </div>
            <div className="stat-icon orange">👥</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchHistory} className="error-retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* History Timeline */}
      {!loading && !error && (
        <div className="timeline-container">
          {Object.entries(groupedHistory).length === 0 ? (
            <div className="empty-state">
              <p>No history found matching your filters</p>
            </div>
          ) : (
            <div className="timeline">
              {Object.entries(groupedHistory).map(([projectId, project]) => (
                <div key={projectId} className="project-group">
                  {/* Project Header */}
                  <div
                    onClick={() => toggleProject(projectId)}
                    className="project-header"
                  >
                    <span className="project-expand-icon">
                      {expandedProjects.has(projectId) ? '▼' : '▶'}
                    </span>
                    <span className="project-icon">📁</span>
                    <span className="project-name">{project.projectName}</span>
                    <span className="project-count">
                      ({Object.keys(project.tasks).length} tasks, {project.items.length} activities)
                    </span>
                  </div>

                  {/* Project Content */}
                  {expandedProjects.has(projectId) && (
                    <div className="project-content">
                      {/* Tasks */}
                      {Object.entries(project.tasks).map(([taskId, task]) => (
                        <div key={taskId} className="task-group">
                          {/* Task Header */}
                          <div
                            onClick={() => toggleTask(taskId)}
                            className="task-header"
                          >
                            <span className="task-expand-icon">
                              {expandedTasks.has(taskId) ? '▼' : '▶'}
                            </span>
                            <span className="task-icon">✓</span>
                            <span className="task-name">{task.taskName}</span>
                            <span className="task-count">({task.items.length} updates)</span>
                          </div>

                          {/* Task Items */}
                          {expandedTasks.has(taskId) && (
                            <div className="task-items">
                              {task.items.map((item) => (
                                <div
                                  key={item.id}
                                  onClick={() => setSelectedItem(item)}
                                  className="history-item"
                                >
                                  <div className="item-status-icon">
                                    {item.status === 'Success' && '✅'}
                                    {item.status === 'Pending' && '⏳'}
                                    {item.status === 'Updated' && '🔄'}
                                    {item.status === 'Deleted' && '🗑️'}
                                    {item.status === 'Created' && '✨'}
                                    {item.status === 'Completed' && '🎉'}
                                  </div>

                                  <div className="item-content">
                                    <div className="item-header">
                                      <span className="item-title">{item.title}</span>
                                      <span className={`type-badge ${item.type.toLowerCase()}`}>
                                        {item.type}
                                      </span>
                                      <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                      </span>
                                    </div>
                                    
                                    {item.description && (
                                      <p className="item-description">{item.description}</p>
                                    )}
                                    
                                    <div className="item-meta">
                                      <span className="meta-user">👤 {item.user}</span>
                                      <span className="meta-time">🕒 {formatRelativeTime(item.time)}</span>
                                      {item.metadata?.duration && (
                                        <span className="meta-duration">⏱️ {item.metadata.duration} min</span>
                                      )}
                                    </div>

                                    {/* Metadata changes */}
                                    {item.metadata?.oldValue && item.metadata?.newValue && (
                                      <div className="metadata-changes">
                                        <p className="metadata-label">Changes:</p>
                                        <pre className="metadata-json">
                                          {JSON.stringify(item.metadata, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Project-level items (no task) */}
                      {project.items.length > 0 && (
                        <div className="project-items">
                          <p className="project-items-label">Project Activities</p>
                          <div className="project-items-list">
                            {project.items.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => setSelectedItem(item)}
                                className="history-item"
                              >
                                <div className="item-status-icon">
                                  {item.status === 'Success' && '✅'}
                                  {item.status === 'Pending' && '⏳'}
                                  {item.status === 'Updated' && '🔄'}
                                  {item.status === 'Deleted' && '🗑️'}
                                  {item.status === 'Created' && '✨'}
                                  {item.status === 'Completed' && '🎉'}
                                </div>

                                <div className="item-content">
                                  <div className="item-header">
                                    <span className="item-title">{item.title}</span>
                                    <span className={`type-badge ${item.type.toLowerCase()}`}>
                                      {item.type}
                                    </span>
                                  </div>
                                  
                                  {item.description && (
                                    <p className="item-description">{item.description}</p>
                                  )}
                                  
                                  <div className="item-meta">
                                    <span className="meta-user">👤 {item.user}</span>
                                    <span className="meta-time">🕒 {formatRelativeTime(item.time)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Activity Details</h3>
              <button onClick={() => setSelectedItem(null)} className="modal-close">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-title">
                <span className="modal-status-icon">
                  {selectedItem.status === 'Success' && '✅'}
                  {selectedItem.status === 'Pending' && '⏳'}
                  {selectedItem.status === 'Updated' && '🔄'}
                  {selectedItem.status === 'Deleted' && '🗑️'}
                  {selectedItem.status === 'Created' && '✨'}
                  {selectedItem.status === 'Completed' && '🎉'}
                </span>
                <span className="modal-title-text">{selectedItem.title}</span>
              </div>

              <div className="modal-details-grid">
                <div className="modal-detail-item">
                  <p className="detail-label">Type</p>
                  <p className="detail-value">{selectedItem.type}</p>
                </div>
                <div className="modal-detail-item">
                  <p className="detail-label">Status</p>
                  <p className="detail-value">{selectedItem.status}</p>
                </div>
                <div className="modal-detail-item">
                  <p className="detail-label">User</p>
                  <p className="detail-value">{selectedItem.user}</p>
                </div>
                <div className="modal-detail-item">
                  <p className="detail-label">Time</p>
                  <p className="detail-value">
                    {new Date(selectedItem.time).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedItem.description && (
                <div className="modal-description">
                  <p className="detail-label">Description</p>
                  <p className="description-text">{selectedItem.description}</p>
                </div>
              )}

              {selectedItem.metadata && (
                <div className="modal-metadata">
                  <p className="detail-label">Additional Data</p>
                  <pre className="metadata-pre">
                    {JSON.stringify(selectedItem.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {selectedItem.projectName && (
                <div className="modal-context">
                  <span>📁 Project: {selectedItem.projectName}</span>
                </div>
              )}

              {selectedItem.taskName && (
                <div className="modal-context">
                  <span>✓ Task: {selectedItem.taskName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;