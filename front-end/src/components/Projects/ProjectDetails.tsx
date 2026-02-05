<<<<<<< HEAD

=======
>>>>>>> 46f5bd4392fd85db61bd38c89c6544bbcbdad7ac
import { useParams } from "react-router-dom";
import TaskBoard from "./TaskBoard";

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) return null;
<<<<<<< HEAD
  
=======

>>>>>>> 46f5bd4392fd85db61bd38c89c6544bbcbdad7ac
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Project {projectId}</h2>
      <TaskBoard projectId={projectId} />
    </div>
  );
};

export default ProjectDetails;