 console.log("KANBAN COMPONENT RENDERED");

import { useEffect, useState } from "react";
import { getProjectsApi } from "../Api/ApiCommon";
import TaskBoard from "./TaskBoard";
import type { Project } from "../Api/ApiCommon";

import "./Kanban.css";

const Kanban = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
  console.log("loadProjects() called");

  try {
    const data = await getProjectsApi();
    console.log("PROJECT API RESPONSE", data);
    setProjects(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Projects API failed", err);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div className="loader">Loading Projects…</div>;

  return (
    <div className="kanban-page">
      {projects.map((project) => (
        <TaskBoard key={project._id} project={project} tasks={[]} columns={[]} refreshColumns={()=>{}}/>
      ))}
    </div>
  );
};

export default Kanban;
