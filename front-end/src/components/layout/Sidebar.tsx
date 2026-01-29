import React, { useState } from "react";
import "./Sidebar.css";
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
  FaDatabase,
  FaBug,
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
  { id: 1, name: "Revamp Flynt", color: "#6366f1" },
  { id: 2, name: "Company Website", color: "#22c55e" },
  { id: 3, name: "Mobile App", color: "#f97316" },
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
      { id: 3, name: "Sneha" },
    ],
  },
  {
    id: 2,
    name: "Backend",
    icon: <FaServer />,
    color: "#22c55e",
    members: [
      { id: 1, name: "John" },
      { id: 2, name: "Amit" },
    ],
  },
  {
    id: 3,
    name: "Database",
    icon: <FaDatabase />,
    color: "#f97316",
    members: [{ id: 1, name: "Priya" }],
  },
  {
    id: 4,
    name: "Tester",
    icon: <FaBug />,
    color: "#ef4444",
    members: [
      { id: 1, name: "Kiran" },
      { id: 2, name: "Neha" },
    ],
  },
];

/* ---------- COMPONENT ---------- */
const Sidebar: React.FC = () => {
  const [activeProject, setActiveProject] = useState<number>(1);
  const [openProjects, setOpenProjects] = useState(true);
  const [openTeams, setOpenTeams] = useState(false);
  const [openTeamId, setOpenTeamId] = useState<number | null>(null);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-icon">⚡</span>
        <h2>Zest</h2>
      </div>

      <nav className="sidebar-menu">
        {/* Dashboard */}
        <div className="menu-item active">
          <FaHome />
          <span>Dashboard</span>
        </div>

        {/* Tasks */}
        <div className="menu-item">
          <FaTasks />
          <span>Tasks</span>
        </div>

        {/* TEAM MENU (MAIN TOGGLE) */}
        <div
          className="menu-item"
          onClick={() => setOpenTeams(!openTeams)}
        >
          <FaUsers />
          <span>Team</span>
          {openTeams ? <FaChevronDown /> : <FaChevronRight />}
        </div>

        {/* TEAMS LIST */}
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
                      style={{ backgroundColor: team.color }}
                    >
                      {team.icon}
                    </span>
                    <span className="team-name">{team.name}</span>
                  </div>

                  <span
                    className="team-count"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.members.length}
                  </span>
                </div>

                {/* MEMBERS */}
                {openTeamId === team.id && (
                  <div className="members-list">
                    {team.members.map((member) => (
                      <div key={member.id} className="member-item">
                        👤 {member.name}
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
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`project-item ${
                    activeProject === project.id ? "active" : ""
                  }`}
                  onClick={() => setActiveProject(project.id)}
                >
                  <span
                    className="project-badge"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="project-name">{project.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="settings">
          <FaCog />
          <span>Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Header;
