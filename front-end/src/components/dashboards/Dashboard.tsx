import { useState } from "react";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import type { Activity } from "./RecentActivity";

import {
  FaUsers,
  FaUserCheck,
  FaTasks,
  FaHourglassHalf,
  FaCheckCircle,
  FaBuilding,
} from "react-icons/fa";

const Dashboard = () => {
  // 🔹 Dynamic stats
  const stats = [
    { title: "Total Employees", value: 128, icon: <FaUsers /> },
    { title: "Active Employees", value: 112, icon: <FaUserCheck /> },
    { title: "Total Tasks", value: 342, icon: <FaTasks /> },
    { title: "Pending Tasks", value: 57, icon: <FaHourglassHalf /> },
    { title: "Completed Tasks", value: 285, icon: <FaCheckCircle /> },
    { title: "Departments", value: 6, icon: <FaBuilding /> },
  ];

  // 🔹 Dynamic activity feed
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      message: "Rahul completed task “UI Fix”",
      time: "10 mins ago",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    {
      id: 2,
      message: "HR added new employee Sneha",
      time: "1 hour ago",
      icon: <FaUsers className="text-blue-500" />,
    },
  ]);

  const simulateActivity = () => {
    setActivities((prev) => [
      {
        id: Date.now(),
        message: "New task assigned to Amit",
        time: "Just now",
        icon: <FaTasks className="text-indigo-500" />,
      },
      ...prev,
    ]);
  };

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* 🔹 STAT CARDS */}
      <div className="dashboard-grid">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* 🔹 DEV ONLY – SIMULATION */}
      <div style={{ marginTop: "24px" }}>
        <button className="simulate-btn" onClick={simulateActivity}>
          Simulate Activity
        </button>
      </div>

      {/* 🔹 RECENT ACTIVITY */}
      <div className="dashboard-bottom">
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
