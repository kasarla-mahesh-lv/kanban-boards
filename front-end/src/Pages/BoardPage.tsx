import { useParams } from "react-router-dom";
import KanbanBoard from "../components/Projects/KanbanBoard";

export default function BoardPage() {
  const { projectId } = useParams();

  return (
    <div>
      <h2 className="text-xl font-semibold p-4 border-b">
        Project: {projectId}
      </h2>

      <KanbanBoard projectId={projectId!} />
    </div>
  );
}
