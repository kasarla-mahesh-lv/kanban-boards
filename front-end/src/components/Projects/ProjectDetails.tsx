import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getProjectByIdApi,
  getTasksByProjectApi,
} from "../Api/ApiService";

import TaskBoard from "./TaskBoard";
import type { Project, Task } from "./types";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    loadProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      if (!projectId) return;

      console.log("PROJECT DETAILS API HIT", projectId);

      const projectData = await getProjectByIdApi(projectId);
      const taskData=await getTasksByProjectApi(projectId);// ✅ NO explicit type

      setProject(projectData);
    //  setTasks(Array.isArray(taskData) ? taskData:[]) 
     setTasks(taskData.data);
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
      <TaskBoard project={project} tasks={tasks} />
    </div>
  );
};

export default ProjectDetails;
