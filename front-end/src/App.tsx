import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";

import Dashboard from "./components/dashboard/Dashboard";
import History from "./components/History";
import Reports from "./Pages/Reports";
import NotificationPage from "./components/notifications/NotificationPage";

import Login from "./Pages/Login";
import Logout from "./Pages/Logout";
import Register from "./components/Auth/Register";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ProjectBoard from "./components/Projects/ProjectBoard";
import Roles from "./components/Roles";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";


const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const showTaskbar = location.pathname === "/";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="right-container">
        <Topbar />
        {showTaskbar && <Taskbar />}

        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/projects/:projectId" element={<ProjectBoard />} />

            
            <Route path="/roles" element={<Roles />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />

        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

export default App;