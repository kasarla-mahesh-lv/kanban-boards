import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useNavigate, NavLink, useParams } from "react-router-dom";
import "./Sidebar.css";
import Login from "../../Pages/Login";
import {
  getProjectsApi,
  createProjectApi,
} from "../Api/ApiService";

=======
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../components/Auth/AuthContext";
import "./Sidebar.css";
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
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


type Project = {
  _id: string;
  title: string;
  description?: string;
};

type Member = {
  id: number;
  name: string;
  color: string;
};

type Team = {
  id: number;
  name: string;
  color: string;
  members: Member[];
};

<<<<<<< HEAD
const Sidebar = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  /* ---------- AUTH ---------- */
  const [showAuth, setShowAuth] = useState(false);

  /* ---------- STATE ---------- */
=======


const PROJECT_KEY = "hrm-projects";
const TEAM_KEY = "hrm-teams";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [openProjects, setOpenProjects] = useState(true);
  const [openTeams, setOpenTeams] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");

  const [showProjectInput, setShowProjectInput] = useState(false);
  const [showTeamInput, setShowTeamInput] = useState(false);

<<<<<<< HEAD
  /* ---------- LOAD PROJECTS (BACKEND) ---------- */
  const loadProjects = async () => {
    try {
      const data = await getProjectsApi();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load projects", error);
    }
  };

=======
  
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
  useEffect(() => {
    loadProjects();
  }, []);

<<<<<<< HEAD
  /* ---------- ADD PROJECT (BACKEND) ---------- */
  const addProject = async () => {
=======
  const saveProjects = (data: Project[]) => {
    setProjects(data);
    localStorage.setItem(PROJECT_KEY, JSON.stringify(data));
  };

  const saveTeams = (data: Team[]) => {
    setTeams(data);
    localStorage.setItem(TEAM_KEY, JSON.stringify(data));
  };

  
  const addProject = () => {
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
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

<<<<<<< HEAD
  /* ---------- TEAM (LOCAL ONLY) ---------- */
=======
  const deleteProject = (id: number) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
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

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      
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

        {/* <div className="menu-item">
          <FaCalendarCheck /> Attendance
        </div> */}

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

<<<<<<< HEAD
        {/* ---------- PROJECTS (BACKEND CONNECTED) ---------- */}
=======
        
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
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
<<<<<<< HEAD
                  key={p._id}
                  className={`project-item ${
                    projectId === p._id ? "active" : ""
                  }`}
                  onClick={() => navigate(`/projects/${p._id}`)}
=======
                  key={p.id}
                  className={`project-item ${activeProject === p.id ? "active" : ""
                    }`}
                  onClick={() => {
                    setActiveProject(p.id);
                    navigate(`/projects/${p.id}`);
                  }}
>>>>>>> 99575ae03d26fc639088e691c819e7fddbe46f8f
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
        <div className="login" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </div>

        <div className="settings">
          <FaCog /> Settings
        </div>
      </div>
      {/* {showAuth && <Login onClose={() => setShowAuth(false)} />} */}
    </aside>
  );
};

export default Sidebar;
