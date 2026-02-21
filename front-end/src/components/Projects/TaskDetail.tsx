import React, { useEffect, useRef, useState } from "react";


import "./TaskDetail.css";
import { getProjectMembersApi, searchProjectMembersApi } from "../Api/ApiCommon";


import {
  FiTag,
  FiCalendar,
  FiZap,
  FiUser,
  FiCheck,
  FiClock,
  FiUsers,
  FiMoreHorizontal,
   FiBold,
  FiItalic,
  FiList,
  FiPaperclip,
  FiSmile,
  FiSend,
    FiX,
   
} from "react-icons/fi";

type Subtask = { id: number; title: string };

// const users = ["Chandu", "Sravani", "Admin", "Lakshmi"];
const typesList = ["Bug", "Feature", "Task", "Label"];

type Props = {
  task: Task;
  taskTitle?: string;
  projectId: string;
  onClose: () => void;
};

type Member = {
  _id: string;
  name: string;
  email?: string;
  
};

const TaskSidebar: React.FC<Props> = ({ taskTitle ,onClose,projectId}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [openField, setOpenField] = useState<string | null>(null);

  const [type, setType] = useState("Select type");
  const [priority, setPriority] = useState("Select priority");
 const [assignees, setAssignees] = useState<Member[]>([]);


  const [search, setSearch] = useState("");
  const [assignSearch, setAssignSearch] = useState("");

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskText, setSubtaskText] = useState("");

  const [description, setDescription] = useState("");

  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [activities, setActivities] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"comments" | "activities">("comments");
  const [members, setMembers] = useState<Member[]>([]);
  // const { projectId } = useParams();
 




  const log = (msg: string) => setActivities((a) => [...a, msg]);
  useEffect(() => {
  if (openField === "assign") {
     getProjectMembersApi(projectId).then(setMembers);
  }
}, [openField,projectId]);


  useEffect(() => {
    const close = (e: any) => {
      if (!ref.current?.contains(e.target)) setOpenField(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const days = new Date(year, month + 1, 0).getDate();

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const addSubtask = () => {
    if (!subtaskText.trim()) return;
    setSubtasks([...subtasks, { id: Date.now(), title: subtaskText }]);
    setSubtaskText("");
    log("Subtask added");
  };

  const handleMemberSearch = async (value: string) => {
  setAssignSearch(value);

  if (!projectId) return;

  if (!value.trim()) {
    const data = await getProjectMembersApi(projectId);
    setMembers(data);
    setMembers([]);
    return;
  }

  const result = await searchProjectMembersApi(projectId, value);
  setMembers(result);
};


  const sendComment = () => {
    if (!commentInput && !file) return;
    setComments([...comments, { text: commentInput, file }]);
    setCommentInput("");
    setFile(null);
    log("Comment added");
  };

  return (
    <div className="drawer" ref={ref}>
      
      <div className="content">
        <h1 className="title">
  {taskTitle || "Task Details"}
</h1>
<FiX className="close-icon" onClick={onClose} />
        {/* TYPES */}
        {/* TYPES */}
<Field
  icon={<FiTag />}
  color="#f59e0b"
  label="Types"
  value={type}
  onClick={() => setOpenField("types")}
/>

{openField === "types" && (
  <Popover>
    <input
      className="search"
      placeholder="Type to search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {typesList
      .filter((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      )
      .map((t) => (
        <Item
          key={t}
          onClick={() => {
            setType(t);
            setOpenField(null);
          }}
        >
          {t}
        </Item>
      ))}
  </Popover>
)}


        {/* DATES */}
        <Field
          icon={<FiCalendar />}
          color="#60a5fa"
          label="Dates"
          value={startDate ? `${startDate} → ${endDate || "..."}` : "No dates set"}
          onClick={() => setOpenField("date")}
        />

        {openField === "date" && (
          <Popover>
            <div className="calendar-header">
              <button onClick={prevMonth}>◀</button>
              <span>
                {new Date(year, month).toLocaleString("default", { month: "long" })} {year}
              </span>
              <button onClick={nextMonth}>▶</button>
            </div>

            <div className="calendar-grid">
              {[...Array(days)].map((_, i) => (
                <div
                  key={i}
                  className="day"
                  onClick={() => {
                    if (!startDate) setStartDate(`${year}-${month + 1}-${i + 1}`);
                    else {
                      setEndDate(`${year}-${month + 1}-${i + 1}`);
                      setOpenField(null);
                    }
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </Popover>
        )}

        {/* PRIORITY */}
        <Field icon={<FiZap />} color="#fb923c" label="Priority" value={priority} onClick={() => setOpenField("priority")} />
        {openField === "priority" && (
          <Popover>
            {["High", "Medium", "Low"].map((p) => (
              <Item key={p} onClick={() => { setPriority(p); setOpenField(null); }}>
                {p}
              </Item>
            ))}
          </Popover>
        )}

        {/* ASSIGN */}
        {/* ASSIGN */}
<Field
  icon={<FiUser />}
  color="#a78bfa"
  label="Assign"
  value={
    assignees.length === 0
      ? "Not assigned"
      : assignees.map(a => a.name).join(", ")
  }
  onClick={() => 
        {
           setAssignSearch("");
           setMembers([]);  
           setOpenField("assign")}
        }
       
/>


{openField === "assign" && (
  <Popover>
    <input
      className="search"
      placeholder="Search user..."
      value={assignSearch}
      onChange={(e) => handleMemberSearch(e.target.value)}
    />

    {assignSearch.trim() !== "" &&  (
      members.length === 0 ? (
      <div className="no-results">No users found</div>
    ) : (
      members.map((m) => (
        <div
          key={m._id}
          className="member-row"
          
          onClick={() => {
            setAssignees((prev) => {
              const exists = prev.find((p) => p._id === m._id);
              if (exists) return prev.filter((p) => p._id !== m._id);
              return [...prev, m];
            });
            setOpenField(null);
          }}
        >
            <input
    type="checkbox"
    checked={assignees.some((a) => a._id === m._id)}
    readOnly
  />
          
           <FiUser className="member-icon" />
          <span className="member-name">{m.name}</span>
          <span className="email-tooltip">{m.email}</span>
        </div>
      ))
    ))}
  </Popover>
)}

   

        {/* SUBTASK TABLE */}
        <div className="subtasks">
          <div className="sub-header">
            <b>{subtasks.length} subtasks</b>
            <span>Customize View</span>
          </div>

          <div className="subtable">
            <div className="subtable-head">
              <FiCheck />
              <span>ID</span>
              <span>TITLE</span>
              <span>GROUP</span>

              <div className="sub-icons">
                <FiClock />
                <FiUsers />
                <FiTag />
                <FiMoreHorizontal />
              </div>
            </div>

            <div className="subtable-input">
              <input
                placeholder="Enter subtask name"
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubtask()}
              />
            </div>

            {subtasks.map((s) => (
              <div key={s.id} className="subtask-row">
                <input type="checkbox" />
                <span>ST-{s.id.toString().slice(-3)}</span>
                <span>{s.title}</span>
                <span>-</span>
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="section">
          <h3>Description</h3>
          <textarea className="desc-box" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* COMMENTS */}
        {/* COMMENTS + ACTIVITIES */}
<div className="section">
  <div className="tabs">
    <button
      className={`tab ${activeTab === "comments" ? "active" : ""}`}
      onClick={() => setActiveTab("comments")}
    >
      Comments {comments.length}
    </button>

    <button
      className={`tab ${activeTab === "activities" ? "active" : ""}`}
      onClick={() => setActiveTab("activities")}
    >
      Activities
    </button>
  </div>

  {activeTab === "comments" && (
    <div className="editor">
      <textarea
        placeholder="Write a comment..."
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
      />

      <div className="editor-toolbar">
        <div className="toolbar-left">
          <FiBold title="Bold" />
          <FiItalic title="Italic" />
          <FiList title="List" />
          <FiPaperclip title="Attach file" />
          <FiSmile title="Emoji" />
        </div>

        <div className="toolbar-right">
          <FiSend
            title="Send comment"
            className="send-icon"
            onClick={sendComment}
          />
        </div>
      </div>

      {comments.map((c, i) => (
        <div key={i} className="comment">
          {c.text}
        </div>
      ))}
    </div>
  )}

  {activeTab === "activities" && (
    <div className="activity-empty">
      {activities.length === 0
        ? "No activity yet"
        : activities.map((a, i) => (
            <div key={i} className="timeline-item">
              <div className="dot" />
              {a}
            </div>
          ))}
    </div>
  )}
</div>


       
      </div>
    </div>
  );
};

const Field = ({ icon, label, value, onClick, color }: any) => (
  <div className="field-row" onClick={onClick}>
    <div className="left">
      <span className="field-icon" style={{ color }}>{icon}</span>
      {label}
    </div>
    <div className="value">{value}</div>
  </div>
);

const Popover = ({ children }: any) => <div className="popover">{children}</div>;
const Item = ({ children, onClick }: any) => <div className="dropdown-item" onClick={onClick}>{children}</div>;

export default TaskSidebar;
