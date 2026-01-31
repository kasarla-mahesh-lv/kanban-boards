import { useNavigate } from "react-router-dom";
import type { Project } from "../types";

export default function ProjectsPage() {
  const navigate = useNavigate();

  const projects: Project[] = [
    { id: "p1", name: "Kanban Board App" },
    { id: "p2", name: "Healthcare System" },
    { id: "p3", name: "Task Manager" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      <div className="grid grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="p-6 bg-white shadow rounded-xl cursor-pointer hover:shadow-lg"
          >
            {project.name}
          </div>
        ))}
      </div>
    </div>
  );
}
