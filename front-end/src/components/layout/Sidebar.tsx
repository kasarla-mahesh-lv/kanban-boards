import React, { useState } from "react";
import "./Sidebar.css";
import {useNavigate} from "react-router-dom"
import {
  FaHome,
  FaTasks,
  FaUsers,
  FaPlus,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaCode,
  FaServer,
  
  FaBug,
  FaSignOutAlt,
  FaCalendarCheck,
  FaFileAlt,
  FaBell,
  FaHistory
} from "react-icons/fa";

/* ---------- TYPES ---------- */
type Project = {
  id: number;
  name: string;
  color: string;
};

type Member = {
  id: number;
  name: string;
};

type Team = {
  id: number;
  name: string;
  icon: JSX.Element;
  color: string;
  members: Member[];
};

/* ---------- DATA ---------- */
const projects: Project[] = [
  { id: 1, name: "PROJECT 1", color: "#6366f1" },
  { id: 2, name: "PROJECT 2", color: "#22c55e" },
  { id: 3, name: "PROJECT 3", color: "#f97316" },
];

const teams: Team[] = [
  {
    id: 1,
    name: "Frontend",
    icon: <FaCode />,
    color: "#6366f1",
    members: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Rahul" },
    ],
  },
  {
    id: 2,
    name: "Backend",
    icon: <FaServer />,
    color: "#22c55e",
    members: [{ id: 1, name: "Amit" }],
  },
  {
    id: 3,
    name: "QA",
    icon: <FaBug />,
    color: "#ef4444",
    members: [{ id: 1, name: "Neha" }],
  },
];

/* ---------- COMPONENT ---------- */
const Sidebar: React.FC = () => {
  const [activeProject, setActiveProject] = useState(1);
  const [openProjects, setOpenProjects] = useState(true);
  const [openTeams, setOpenTeams] = useState(false);
  const [openTeamId, setOpenTeamId] = useState<number | null>(null);
  const navigate=useNavigate();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">⚡</span>
        <h2>HRM</h2>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-item active">
          <FaHome />
          <span>Dashboard</span>
        </div>

        <div className="menu-item">
          <FaTasks />
          <span>Tasks</span>
        </div>

        <div className="menu-item">
          <FaCalendarCheck />
          <span>Attendance</span>
        </div>

        <div className="menu-item">
          <FaHistory/>
          <span>History</span>
        </div>

        <div className="menu-item">
          <FaFileAlt />
          <span>Reports</span>
        </div>

        <div className="menu-item notification">
          <FaBell />
          <span>Notifications</span>
          <span className="badge">3</span>
        </div>

        {/* TEAM */}
        <div className="menu-item" onClick={() => setOpenTeams(!openTeams)}>
          <FaUsers />
          <span>Team</span>
          {openTeams ? <FaChevronDown /> : <FaChevronRight />}
        </div>

        {openTeams && (
          <div className="teams-wrapper">
            {teams.map((team) => (
              <div key={team.id}>
                <div
                  className="team-item"
                  onClick={() =>
                    setOpenTeamId(openTeamId === team.id ? null : team.id)
                  }
                >
                  <div className="team-left">
                    <span
                      className="team-icon"
                      style={{ background: team.color }}
                    >
                      {team.icon}
                    </span>
                    <span>{team.name}</span>
                  </div>
                  <span className="team-count">{team.members.length}</span>
                </div>

                {openTeamId === team.id && (
                  <div className="members-list">
                    {team.members.map((m) => (
                      <div key={m.id} className="member-item">
                        👤 {m.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS */}
        <div className="projects-section">
          <div
            className="projects-header"
            onClick={() => setOpenProjects(!openProjects)}
          >
            {openProjects ? <FaChevronDown /> : <FaChevronRight />}
            <span>Projects</span>
            <FaPlus className="add-project" />
          </div>

          {openProjects && (
            <div className="projects-list">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className={`project-item ${
                    activeProject === p.id ? "active" : ""
                  }`}
                  onClick={()=>{
                    setActiveProject(p.id);
                    navigate(`/projects/${p.id}`);
                  }}
                >
                  <span
                    className="project-badge"
                    style={{ background: p.color }}
                  />
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <div className="logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </div>

        <div className="settings">
          <FaCog />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
