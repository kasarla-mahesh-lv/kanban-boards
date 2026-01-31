import "./Taskbar.css";

export const Taskbar = () => {
  return (
    <div className="taskbar">
      <div className="breadcrumb">
        <a>Projects</a>
        <span>›</span>
        <strong>Luvetha Tech</strong>
      </div>

      <h2 className="project-title">LuvethaTech</h2>

      <div className="meta-line">
        <span><strong>Timeline:</strong> Jan–Mar</span>
        <span><strong>Client:</strong> Luvetha</span>
        <span><strong>Status:</strong> In Progress</span>
        <span><strong>Assignees:</strong> -</span>
      </div>

      <ul className="nav-line">
        <li>Task Board</li>
        <li>Timeline</li>
        <li>Updates</li>
      </ul>
    </div>
  );
};
