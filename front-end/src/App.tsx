import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import ProjectDetails from "./components/Projects/ProjectDetails";
import Dashboard from "./components/dashboard/Dashboard";
import NotificationPage from "./components/notifications/NotificationPage";

import { Routes, Route } from "react-router-dom";

import "./App.css";

const AppLayout: React.FC = () => {
  const location = useLocation();

  // ✅ Dashboard page lo matrame Taskbar chupinchu
  const showTaskbar = location.pathname === "/";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="right-container">
        <div className="content-container">
          <Topbar />
          <Taskbar />

          {/* 🔥 ROUTES HERE */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notifications" element={<NotificationPage />} />
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
