import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../components/Auth/AuthContext";
import Settings from "./Settings";
import "./Sidebar.css";

import {
  FaHome,
  FaTasks,
  FaUsers,
  FaPlus,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaFileAlt,
  FaBell,
  FaHistory,
} from "react-icons/fa";

import { getProjectsApi, createProjectApi, type Project } from "../Api/ApiCommon";

type Member = { id: number; name: string; color: string };
type Team = { id: number; name: string; color: string; members: Member[] };

const TEAM_KEY = "hrm-teams";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [openProjects, setOpenProjects] = useState(true);
  const [openTeams, setOpenTeams] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");

  const [showProjectInput, setShowProjectInput] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ✅ If current route is /roles, stop highlighting projects
  const isRolesPage = useMemo(
    () => location.pathname === "/roles",
    [location.pathname]
  );

  useEffect(() => {
    setTeams(JSON.parse(localStorage.getItem(TEAM_KEY) || "[]"));

    (async () => {
      try {
        setLoadingProjects(true);
        const data = await getProjectsApi();
        setProjects(data);
      } catch (e) {
        console.log("Projects load failed:", e);
      } finally {
        setLoadingProjects(false);
      }
    })();
  }, []);

  const saveTeams = (data: Team[]) => {
    setTeams(data);
    localStorage.setItem(TEAM_KEY, JSON.stringify(data));
  };

  const addProject = async () => {
    const title = newProjectName.trim();
    if (!title) return;

    try {
      const created = await createProjectApi({ title });
      setProjects((prev) => [created, ...prev]);

      setNewProjectName("");
      setShowProjectInput(false);

      setActiveProjectId(created._id);
      navigate(`/projects/${created._id}`);
    } catch (e) {
      console.log("Create project failed:", e);
    }
  };

  const addTeam = () => {
    if (!newTeamName.trim()) return;

    const team: Team = {
      id: Date.now(),
      name: newTeamName.trim(),
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

  const handleLogout = () => {
    logout();
    navigate("/logout");
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <aside className="sidebar">
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
              {loadingProjects && (
                <div style={{ padding: "8px 10px", opacity: 0.7 }}>
                  Loading projects...
                </div>
              )}

              {projects.map((p) => (
                <div
                  key={p._id}
                  // ✅ On /roles: don't apply "active" class to projects
                  className={`project-item ${
                    !isRolesPage && activeProjectId === p._id ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveProjectId(p._id);
                    navigate(`/projects/${p._id}`);
                  }}
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

      <div className="sidebar-bottom">
        {/* ✅ Roles styled like Settings */}
        <NavLink
          to="/roles"
          className={({ isActive }) =>
            isActive ? "Roles RolesActive" : "Roles"
          }
          onClick={() => {
            // ✅ optional: clear last project highlight when going to roles
            // setActiveProjectId(null);
          }}
        >
          <FaUsers />
          <span>Roles</span>
        </NavLink>

        <div className="settings" onClick={openSettings}>
          <FaCog /> Settings
        </div>
      </div>

      <div className="login" onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </div>

      <Settings
        projectId={activeProjectId || undefined}
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
    </aside>
  );
};

export default Sidebar;