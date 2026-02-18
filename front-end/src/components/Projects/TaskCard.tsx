import type { Task } from "./types";

const TaskCard = ({ task }: { task: Task }) => {
    
        const onDragStart=(e:React.DragEvent<HTMLDivElement>)=>{
         e.dataTransfer.setData("taskId",task.id);
        };
    
  return (
    <div
    draggable
    onDragStart={onDragStart}
      style={{
        background: "#fff",
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <small>{task.code}</small>
      <div>{task.title}</div>
    </div>
  );
};

export default TaskCard;