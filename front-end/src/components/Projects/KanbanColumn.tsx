import type { Task, TaskStatus} from "./types";
import TaskCard from "./TaskCard";

type Props = {
  title: string;
  status:TaskStatus;
  tasks: Task[];
  onDropTask:(taskId:string,status:TaskStatus)=>void;
  
};
 
const KanbanColumn = ({ title, tasks,status,onDropTask }: Props) => {
    const onDragOver=(e:React.DragEvent<HTMLDivElement>)=>{
        e.preventDefault();
    };
     const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const taskId = e.dataTransfer.getData("taskId");
    onDropTask(taskId, status);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        width: 260,
        background: "#f8fafc",
        padding: 12,
        borderRadius: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>{title}</b>
        <span>{tasks.length} tasks</span>
      </div>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      <button
        style={{
          marginTop: 8,
          border: "none",
          background: "none",
          color: "#64748b",
          cursor: "pointer",
        }}
      >
        + Add task
      </button>
    </div>
  );
};

export default KanbanColumn;