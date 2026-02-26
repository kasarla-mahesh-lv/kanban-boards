
import React, { useEffect, useMemo, useState } from "react";
import "./History.css";

type HistoryType = "Task" | "Attendance" | "Project" | "System";
type HistoryStatus = "Success" | "Pending" | "Updated" | "Deleted";

type HistoryItem = {
  id: number | string;
  title: string;
  description?: string;
  type: HistoryType;
  status: HistoryStatus;
  user: string;
  time: string; // ISO string from backend
};

const API_URL = import.meta.env.VITE_API_URL; 
// example: VITE_API_URL=http://localhost:5000

const History: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | HistoryType>("All");

  // ✅ 1) Fetch dynamic history from backend
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
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ✅ 2) Search + Filter (client side)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((it) => {
      const matchesType = typeFilter === "All" ? true : it.type === typeFilter;
      const matchesSearch =
        !q ||
        it.title.toLowerCase().includes(q) ||
        (it.description || "").toLowerCase().includes(q) ||
        it.user.toLowerCase().includes(q);

      return matchesType && matchesSearch;
    });
  }, [items, search, typeFilter]);

  // ✅ 3) Summary cards counts
  const stats = useMemo(() => {
    const total = filtered.length;
    const success = filtered.filter((x) => x.status === "Success").length;
    const updated = filtered.filter((x) => x.status === "Updated").length;
    const deleted = filtered.filter((x) => x.status === "Deleted").length;

    return { total, success, updated, deleted };
  }, [filtered]);

  // ✅ time format
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso; // if backend sends already formatted text
    return d.toLocaleString(); // you can customize
  };

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1>History</h1>
          <p>Track tasks, attendance, and system changes.</p>
        </div>

        <div className="history-controls">
          <div className="search-box">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
          >
            <option value="All">All</option>
            <option value="Task">Task</option>
            <option value="Attendance">Attendance</option>
            <option value="Project">Project</option>
            <option value="System">System</option>
          </select>

          <button className="refresh-btn" onClick={fetchHistory}>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <div className="history-state">Loading history...</div>}
      {error && (
        <div className="history-state error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="history-cards">
            <div className="card">
              <span>Total Logs</span>
              <b>{stats.total}</b>
            </div>
            <div className="card">
              <span>Success</span>
              <b>{stats.success}</b>
            </div>
            <div className="card">
              <span>Updated</span>
              <b>{stats.updated}</b>
            </div>
            <div className="card">
              <span>Deleted</span>
              <b>{stats.deleted}</b>
            </div>
          </div>

          {/* Table */}
          <div className="history-table">
            <div className="table-head">
              <h3>Activity Logs</h3>
              <span>{filtered.length} results</span>
            </div>

            {filtered.length === 0 ? (
              <div className="history-state">No history found.</div>
            ) : (
              <table>
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
                  {filtered.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <div className="activity-title">{it.title}</div>
                        <div className="activity-desc">{it.description}</div>
                      </td>
                      <td>
                        <span className={`pill type ${it.type.toLowerCase()}`}>
                          {it.type}
                        </span>
                      </td>
                      <td>{it.user}</td>
                      <td>
                        <span
                          className={`pill status ${it.status.toLowerCase()}`}
                        >
                          {it.status}
                        </span>
                      </td>
                      <td>{formatTime(it.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;

