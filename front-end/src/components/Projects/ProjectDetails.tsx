import { useParams } from "react-router-dom";
import TaskBoard from "./TaskBoard";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) return null;

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Project {projectId}</h2>
      <TaskBoard projectId={projectId} />
    </div>
  );
};

export default ProjectDetails;