import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import ProjectDetails from "./components/Projects/ProjectDetails";
import Dashboard from "./components/dashboard/Dashboard";
import History from "./components/History";
import Reports  from "./Pages/Reports"
import Logout from "./Pages/Logout";
import "./App.css";

const AppLayout: React.FC = () => {
  const location = useLocation();

  // ✅ Dashboard page lo matrame Taskbar chupinchu
  const showTaskbar = location.pathname === "/";

  return (
    <div className="app-layout">
      {/* LEFT */}
      <Sidebar />

      {/* RIGHT */}
      <div className="right-container">
        {/* TOPBAR ALWAYS */}
        <Topbar />

        {/* TASKBAR ONLY FOR DASHBOARD */}
        {showTaskbar && <Taskbar />}

        {/* PAGE CONTENT */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} /> 
            <Route path="/reports" element={<Reports />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;



