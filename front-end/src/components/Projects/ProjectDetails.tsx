import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";




import {
  getProjectByIdApi,
  getTasksByProjectApi,
  getProjectColumnsApi,
  type Column,
} from "../Api/ApiCommon";

import TaskBoard from "./TaskBoard";
import type { Project, Task } from "./types";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [columns, setColumns] = useState<Column[]>([]);




  useEffect(() => {
    if (!projectId) return;
    loadProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

const loadProjectDetails = async () => {
  try {
    if (!projectId) return;

    const projectData = await getProjectByIdApi(projectId);
    const taskData = await getTasksByProjectApi(projectId);
    const columnsData = await getProjectColumnsApi(projectId); // 👈 add

    setProject(projectData);
    setTasks(taskData);
    setColumns(columnsData); // 👈 add
  } catch (error) {
    console.error("Failed to load project details", error);
  } finally {
    setLoading(false);
  }
};


  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div>
      <h1>{project.title}</h1>
      <TaskBoard 
  project={project} 
  tasks={tasks} 
  columns={columns}
  refreshColumns={loadProjectDetails}
/>

    </div>
  );
};

export default ProjectDetails;
