import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useParams } from "react-router-dom";
import "./Sidebar.css";
import Login from "../../Pages/Login";
import {
  getProjectsApi,
  createProjectApi,
} from "../Api/ApiService";

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

/* ---------- TYPES ---------- */
type Project = {
  _id: string;
  title: string;
  description?: string;
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

const Sidebar = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  /* ---------- AUTH ---------- */
  const [showAuth, setShowAuth] = useState(false);

  /* ---------- STATE ---------- */
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [openProjects, setOpenProjects] = useState(true);
  const [openTeams, setOpenTeams] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");

  const [showProjectInput, setShowProjectInput] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);

  /* ---------- LOAD PROJECTS (BACKEND) ---------- */
  const loadProjects = async () => {
    try {
      const data = await getProjectsApi();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ---------- ADD PROJECT (BACKEND) ---------- */
  const addProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      await createProjectApi({
        title: newProjectName,
      });

      setNewProjectName("");
      setShowProjectInput(false);
      loadProjects(); // 🔁 refresh from backend
    } catch (error) {
      console.error("Create project failed", error);
    }
  };

  /* ---------- TEAM (LOCAL ONLY) ---------- */
  const addTeam = () => {
    if (!newTeamName.trim()) return;

    const team: Team = {
      id: Date.now(),
      name: newTeamName,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      members: [],
    };

    setTeams((prev) => [...prev, team]);
    setNewTeamName("");
    setShowTeamInput(false);
  };

  const deleteTeam = (id: number) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-logo">
        ⚡ <h2>HRM</h2>
      </div>

      <nav className="sidebar-menu">
        {/* MAIN MENU */}
        <div className="menu-item" onClick={() => navigate("/")}>
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
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaHistory /> History
        </NavLink>

        <NavLink to="/reports" className="menu-item">
          <FaFileAlt /> Reports
        </NavLink>

        <div className="menu-item" onClick={() => navigate("/notifications")}>
          <FaBell /> Notifications
        </div>

        {/* ---------- TEAMS ---------- */}
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
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTeam(team.id);
                  }}
                >
                  ❌
                </span>
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

        {/* ---------- PROJECTS (BACKEND CONNECTED) ---------- */}
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
                  key={p._id}
                  className={`project-item ${
                    projectId === p._id ? "active" : ""
                  }`}
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  {p.title}
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

      {/* ---------- BOTTOM ---------- */}
      <div className="sidebar-bottom">
        <div className="login" onClick={() => setShowAuth(true)}>
          <FaSignOutAlt />
          <span>Login</span>
        </div>

        <div className="settings">
          <FaCog /> Settings
        </div>
      </div>

      {/* ---------- LOGIN MODAL ---------- */}
      {showAuth && <Login onClose={() => setShowAuth(false)} />}
    </aside>
  );
};

export default Sidebar;
