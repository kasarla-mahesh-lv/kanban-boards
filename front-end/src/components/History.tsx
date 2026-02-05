import React, { useMemo, useState } from "react";
import "./History.css";
import { FaSearch, FaFilter, FaCheckCircle, FaClock, FaTrash, FaEdit } from "react-icons/fa";

type HistoryType = "Task" | "Attendance" | "Project" | "System";
type HistoryStatus = "Success" | "Pending" | "Updated" | "Deleted";

type HistoryItem = {
  id: number;
  title: string;
  description: string;
  type: HistoryType;
  status: HistoryStatus;
  user: string;
  time: string; // e.g. "Today • 10:45 AM"
};

const historyData: HistoryItem[] = [
  {
    id: 1,
    title: "Task Completed",
    description: "UI fixes done in Topbar Search alignment",
    type: "Task",
    status: "Success",
    user: "Alice",
    time: "Today • 10:45 AM",
  },
  {
    id: 2,
    title: "Attendance Marked",
    description: "Check-in marked for Rahul",
    type: "Attendance",
    status: "Success",
    user: "Rahul",
    time: "Today • 09:12 AM",
  },
  {
    id: 3,
    title: "Task Updated",
    description: "Changed priority from Medium → High",
    type: "Task",
    status: "Updated",
    user: "Neha",
    time: "Yesterday • 06:20 PM",
  },
  {
    id: 4,
    title: "Task Deleted",
    description: "Removed duplicate QA bug card",
    type: "Task",
    status: "Deleted",
    user: "Neha",
    time: "Yesterday • 04:05 PM",
  },
  {
    id: 5,
    title: "Project Timeline Updated",
    description: "Timeline changed: Jan–Mar → Jan–Apr",
    type: "Project",
    status: "Updated",
    user: "Amit",
    time: "2 days ago • 01:30 PM",
  },
];

const History: React.FC = () => {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<HistoryType | "All">("All");

  const filtered = useMemo(() => {
    return historyData.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.user.toLowerCase().includes(query.toLowerCase());

      const matchesType = typeFilter === "All" ? true : item.type === typeFilter;

      return matchesQuery && matchesType;
    });
  }, [query, typeFilter]);

  const stats = useMemo(() => {
    const total = historyData.length;
    const success = historyData.filter((h) => h.status === "Success").length;
    const updated = historyData.filter((h) => h.status === "Updated").length;
    const deleted = historyData.filter((h) => h.status === "Deleted").length;

    return { total, success, updated, deleted };
  }, []);

  const getStatusPill = (status: HistoryStatus) => {
    const cls =
      status === "Success"
        ? "pill success"
        : status === "Pending"
        ? "pill pending"
        : status === "Updated"
        ? "pill updated"
        : "pill deleted";

    const icon =
      status === "Success"
        ? <FaCheckCircle />
        : status === "Pending"
        ? <FaClock />
        : status === "Updated"
        ? <FaEdit />
        : <FaTrash />;

    return (
      <span className={cls}>
        {icon} {status}
      </span>
    );
  };

  return (
    <div className="history-page">
      {/* TOP TITLE */}
      <div className="history-header">
        <div>
          <h2 className="history-title">History</h2>
          <p className="history-subtitle">Track tasks, attendance, and system changes.</p>
        </div>

        {/* SEARCH + FILTER */}
        <div className="history-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search history..."
            />
          </div>

          <div className="filter-box">
            <FaFilter className="filter-icon" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
              <option value="All">All</option>
              <option value="Task">Task</option>
              <option value="Attendance">Attendance</option>
              <option value="Project">Project</option>
              <option value="System">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATS CARDS (LIKE DASHBOARD) */}
      <div className="history-stats">
        <div className="stat-card">
          <p>Total Logs</p>
          <h3>{stats.total}</h3>
        </div>

        <div className="stat-card">
          <p>Success</p>
          <h3>{stats.success}</h3>
        </div>

        <div className="stat-card">
          <p>Updated</p>
          <h3>{stats.updated}</h3>
        </div>

        <div className="stat-card">
          <p>Deleted</p>
          <h3>{stats.deleted}</h3>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="history-card">
        <div className="history-card-head">
          <h3>Activity Logs</h3>
          <span className="muted">{filtered.length} results</span>
        </div>

        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>User</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-row">
                    No history found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="activity">
                        <div className="activity-title">{item.title}</div>
                        <div className="activity-desc">{item.description}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge type-${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>{item.user}</td>
                    <td>{getStatusPill(item.status)}</td>
                    <td className="muted">{item.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
