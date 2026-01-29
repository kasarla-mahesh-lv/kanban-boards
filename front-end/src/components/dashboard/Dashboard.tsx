import StatCard from "./StatCard";
import {
  FaUsers,
  FaUserCheck,
  FaTasks,
  FaHourglassHalf,
  FaCheckCircle,
  FaBuilding,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">
        <StatCard title="Total Employees" value={128} icon={<FaUsers />} />
        <StatCard title="Active Employees" value={112} icon={<FaUserCheck />} />
        <StatCard title="Total Tasks" value={342} icon={<FaTasks />} />
        <StatCard title="Pending Tasks" value={57} icon={<FaHourglassHalf />} />
        <StatCard title="Completed Tasks" value={285} icon={<FaCheckCircle />} />
        <StatCard title="Departments" value={6} icon={<FaBuilding />} />
      </div>
    </div>
  );
};

export default Dashboard;
