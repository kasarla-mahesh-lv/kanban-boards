import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaTasks,
  FaUsers,
  FaPlus,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaCalendarCheck,
  FaFileAlt,
  FaBell,
  FaHistory,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

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
  color: string;
  members: Member[];
};

/* ---------- STORAGE KEYS ---------- */
const PROJECT_KEY = "hrm-projects";
const TEAM_KEY = "hrm-teams";

/* ---------- COMPONENT ---------- */
const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [activeProject, setActiveProject] = useState<number | null>(null);

  const [openProjects, setOpenProjects] = useState(true);
  const [openTeams, setOpenTeams] = useState(false);
  const [openTeamId, setOpenTeamId] = useState<number | null>(null);
  

  /* NEW INPUT STATES */
  const [newProjectName, setNewProjectName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");

  const [showProjectInput, setShowProjectInput] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);

  /* ================= LOAD FROM STORAGE ================= */

  useEffect(() => {
    setProjects(JSON.parse(localStorage.getItem(PROJECT_KEY) || "[]"));
    setTeams(JSON.parse(localStorage.getItem(TEAM_KEY) || "[]"));
  }, []);

  const saveProjects = (data: Project[]) => {
    setProjects(data);
    localStorage.setItem(PROJECT_KEY, JSON.stringify(data));
  };

  const saveTeams = (data: Team[]) => {
    setTeams(data);
    localStorage.setItem(TEAM_KEY, JSON.stringify(data));
  };

  /* ================= PROJECT CRUD ================= */

  const addProject = () => {
    if (!newProjectName.trim()) return;

    const project: Project = {
      id: Date.now(),
      name: newProjectName,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };

    saveProjects([...projects, project]);

    setNewProjectName("");
    setShowProjectInput(false);
  };

  const deleteProject = (id: number) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  /* ================= TEAM CRUD ================= */

  const addTeam = () => {
    if (!newTeamName.trim()) return;

    const team: Team = {
      id: Date.now(),
      name: newTeamName,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      members: [],
    };

    saveTeams([...teams, team]);

    setNewTeamName("");
    setShowTeamInput(false);
  };

  const deleteTeam = (id: number) => {
    saveTeams(teams.filter((t) => t.id !== id));
  };

  /* ================================================= */

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        ⚡ <h2>HRM</h2>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-item active" onClick={() => navigate("/")}>
          <FaHome /> Dashboard
        </div>

        <div className="menu-item">
          <FaTasks /> Tasks
        </div>

        <div className="menu-item">
          <FaCalendarCheck /> Attendance
        </div>

        <NavLink
          to="/history"
          className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <FaHistory />
          <span>History</span>
        </NavLink>

       <NavLink to="/reports" className="menu-item">
          <FaFileAlt />
          <span>Reports</span>
        </NavLink>

        <div className="menu-item" onClick={() => navigate("/notifications")}>
          <FaBell /> Notifications
        </div>

        {/* ================= TEAMS ================= */}
        <div className="menu-item" onClick={() => setOpenTeams(!openTeams)}>
          <FaUsers /> Teams
          {openTeams ? <FaChevronDown /> : <FaChevronRight />}
          <FaPlus
            style={{ marginLeft: "auto" }}
            onClick={(e) => {
              e.stopPropagation();
              setShowTeamInput(true);
            }}
          />
        </div>

        {openTeams && (
          <div className="teams-wrapper">
            {teams.map((team) => (
              <div key={team.id} className="team-item">
                <span>{team.name}</span>
                <span onClick={() => deleteTeam(team.id)}>❌</span>
              </div>
            ))}

            {showTeamInput && (
              <input
                className="sidebar-input"
                placeholder="Team name..."
                autoFocus
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTeam()}
              />
            )}
          </div>
        )}

        {/* ================= PROJECTS ================= */}
        <div className="projects-section">
          <div
            className="projects-header"
            onClick={() => setOpenProjects(!openProjects)}
          >
            {openProjects ? <FaChevronDown /> : <FaChevronRight />}
            Projects
            <FaPlus
              style={{ marginLeft: "auto" }}
              onClick={(e) => {
                e.stopPropagation();
                setShowProjectInput(true);
              }}
            />
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
                  {p.name}
                  <span onClick={() => deleteProject(p.id)}>❌</span>
                </div>
              ))}

              {showProjectInput && (
                <input
                  className="sidebar-input"
                  placeholder="Project name..."
                  autoFocus
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProject()}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <NavLink to="/logout" className="logout">
  <FaSignOutAlt />
  <span>Logout</span>
</NavLink>

        <div className="settings">
          <FaCog /> Settings
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;