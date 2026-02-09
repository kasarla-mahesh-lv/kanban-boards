import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";

import Dashboard from "./components/dashboard/Dashboard";
import History from "./components/History";
import Reports from "./Pages/Reports";
import NotificationPage from "./components/notifications/NotificationPage";

import Login from "./Pages/Login";
import Logout from "./Pages/Logout";

import Kanban from "./components/Projects/Kanban";
import ProjectDetails from "./components/Projects/ProjectDetails";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

/* ================= APP LAYOUT ================= */
const AppLayout: React.FC = () => {
  const location = useLocation();

  // Taskbar only on dashboard
  const showTaskbar = location.pathname === "/";

  return (
    <div className="app-layout">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <div className="right-container">
        {/* TOP BAR */}
        <Topbar />

        {showTaskbar && <Taskbar />}

        {/* MAIN CONTENT */}
        <div className="content-container">
          <Routes>
            {/* DASHBOARD */}
            <Route path="/" element={<Dashboard />} />

            {/* PROJECTS */}
            <Route path="/projects" element={<Kanban />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />

            {/* OTHER PAGES */}
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<NotificationPage />} />

            {/* AUTH */}
            <Route path="/login" element={<Login onClose={() => {}} />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>

      {/* GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

/* ================= ROOT APP ================= */
const App: React.FC = () => {
  return <AppLayout />;
};

export default App;
