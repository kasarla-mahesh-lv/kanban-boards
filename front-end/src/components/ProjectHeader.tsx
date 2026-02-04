import "./ProjectHeader.css";

type Member = {
  id: number;
  avatar: string;
};

interface ProjectHeaderProps {
  title: string;
  timeline: string;
  client: string;
  status: "In Progress" | "Completed";
  members: Member[];
}

const ProjectHeader = ({
  title,
  timeline,
  client,
  status,
  members=[],
}: ProjectHeaderProps) => {
  return (
    <section className="project-header">
      {/* top bar */}
      <div className="top-row">
        <input
          type="text"
          placeholder="Search tasks, members..."
          className="search-box"
        />

        <div className="theme-icons">
          <button>☀️</button>
          <button>🌙</button>
        </div>
      </div>

      {/* project info */}
      <div className="info-row">
        <h2>😎 {title}</h2>

        <div className="meta-row">
          <span><strong>Timeline:</strong> {timeline}</span>
          <span><strong>Client:</strong> {client}</span>

          <span className={`status ${status === "In Progress" ? "progress" : "done"}`}>
            {status}
          </span>

          <div className="avatars">
            {members.slice(0, 3).map((m) => (
              <img key={m.id} src={m.avatar} alt="member" />
            ))}
            {members.length > 3 && (
              <span className="more">+{members.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHeader;
