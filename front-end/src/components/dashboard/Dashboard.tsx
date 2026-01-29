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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
