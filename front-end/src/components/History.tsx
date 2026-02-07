// import React, { useMemo, useState } from "react";
// import "./History.css";
// import { FaSearch, FaFilter, FaCheckCircle, FaClock, FaTrash, FaEdit } from "react-icons/fa";

// type HistoryType = "Task" | "Attendance" | "Project" | "System";
// type HistoryStatus = "Success" | "Pending" | "Updated" | "Deleted";

// type HistoryItem = {
//   id: number;
//   title: string;
//   description: string;
//   type: HistoryType;
//   status: HistoryStatus;
//   user: string;
//   time: string; // e.g. "Today • 10:45 AM"
// };

// const historyData: HistoryItem[] = [
//   {
//     id: 1,
//     title: "Task Completed",
//     description: "UI fixes done in Topbar Search alignment",
//     type: "Task",
//     status: "Success",
//     user: "Alice",
//     time: "Today • 10:45 AM",
//   },
//   {
//     id: 2,
//     title: "Attendance Marked",
//     description: "Check-in marked for Rahul",
//     type: "Attendance",
//     status: "Success",
//     user: "Rahul",
//     time: "Today • 09:12 AM",
//   },
//   {
//     id: 3,
//     title: "Task Updated",
//     description: "Changed priority from Medium → High",
//     type: "Task",
//     status: "Updated",
//     user: "Neha",
//     time: "Yesterday • 06:20 PM",
//   },
//   {
//     id: 4,
//     title: "Task Deleted",
//     description: "Removed duplicate QA bug card",
//     type: "Task",
//     status: "Deleted",
//     user: "Neha",
//     time: "Yesterday • 04:05 PM",
//   },
//   {
//     id: 5,
//     title: "Project Timeline Updated",
//     description: "Timeline changed: Jan–Mar → Jan–Apr",
//     type: "Project",
//     status: "Updated",
//     user: "Amit",
//     time: "2 days ago • 01:30 PM",
//   },
// ];

// const History: React.FC = () => {
//   const [query, setQuery] = useState("");
//   const [typeFilter, setTypeFilter] = useState<HistoryType | "All">("All");

//   const filtered = useMemo(() => {
//     return historyData.filter((item) => {
//       const matchesQuery =
//         item.title.toLowerCase().includes(query.toLowerCase()) ||
//         item.description.toLowerCase().includes(query.toLowerCase()) ||
//         item.user.toLowerCase().includes(query.toLowerCase());

//       const matchesType = typeFilter === "All" ? true : item.type === typeFilter;

//       return matchesQuery && matchesType;
//     });
//   }, [query, typeFilter]);

//   const stats = useMemo(() => {
//     const total = historyData.length;
//     const success = historyData.filter((h) => h.status === "Success").length;
//     const updated = historyData.filter((h) => h.status === "Updated").length;
//     const deleted = historyData.filter((h) => h.status === "Deleted").length;

//     return { total, success, updated, deleted };
//   }, []);

//   const getStatusPill = (status: HistoryStatus) => {
//     const cls =
//       status === "Success"
//         ? "pill success"
//         : status === "Pending"
//         ? "pill pending"
//         : status === "Updated"
//         ? "pill updated"
//         : "pill deleted";

//     const icon =
//       status === "Success"
//         ? <FaCheckCircle />
//         : status === "Pending"
//         ? <FaClock />
//         : status === "Updated"
//         ? <FaEdit />
//         : <FaTrash />;

//     return (
//       <span className={cls}>
//         {icon} {status}
//       </span>
//     );
//   };

//   return (
//     <div className="history-page">
//       {/* TOP TITLE */}
//       <div className="history-header">
//         <div>
//           <h2 className="history-title">History</h2>
//           <p className="history-subtitle">Track tasks, attendance, and system changes.</p>
//         </div>

//         {/* SEARCH + FILTER */}
//         <div className="history-controls">
//           <div className="search-box">
//             <FaSearch className="search-icon" />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search history..."
//             />
//           </div>

//           <div className="filter-box">
//             <FaFilter className="filter-icon" />
//             <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}>
//               <option value="All">All</option>
//               <option value="Task">Task</option>
//               <option value="Attendance">Attendance</option>
//               <option value="Project">Project</option>
//               <option value="System">System</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* STATS CARDS (LIKE DASHBOARD) */}
//       <div className="history-stats">
//         <div className="stat-card">
//           <p>Total Logs</p>
//           <h3>{stats.total}</h3>
//         </div>

//         <div className="stat-card">
//           <p>Success</p>
//           <h3>{stats.success}</h3>
//         </div>

//         <div className="stat-card">
//           <p>Updated</p>
//           <h3>{stats.updated}</h3>
//         </div>

//         <div className="stat-card">
//           <p>Deleted</p>
//           <h3>{stats.deleted}</h3>
//         </div>
//       </div>

//       {/* HISTORY TABLE */}
//       <div className="history-card">
//         <div className="history-card-head">
//           <h3>Activity Logs</h3>
//           <span className="muted">{filtered.length} results</span>
//         </div>

//         <div className="history-table-wrap">
//           <table className="history-table">
//             <thead>
//               <tr>
//                 <th>Activity</th>
//                 <th>Type</th>
//                 <th>User</th>
//                 <th>Status</th>
//                 <th>Time</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="empty-row">
//                     No history found.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((item) => (
//                   <tr key={item.id}>
//                     <td>
//                       <div className="activity">
//                         <div className="activity-title">{item.title}</div>
//                         <div className="activity-desc">{item.description}</div>
//                       </div>
//                     </td>
//                     <td>
//                       <span className={`type-badge type-${item.type.toLowerCase()}`}>
//                         {item.type}
//                       </span>
//                     </td>
//                     <td>{item.user}</td>
//                     <td>{getStatusPill(item.status)}</td>
//                     <td className="muted">{item.time}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default History;














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

