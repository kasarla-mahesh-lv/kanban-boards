
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
import Register from "./components/Auth/Register";

import ProtectedRoute from "./components/Auth/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

/* ✅ Dashboard Layout only (NO login/register here) */
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
            {/* DASHBOARD */}
            <Route path="/" element={<Dashboard />} />

            {/* PROJECTS */}
            
            

            {/* OTHER PAGES */}
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

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

const App: React.FC = () => {
  return (
    <Routes>
      {/* ✅ PUBLIC (no dashboard layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ✅ PROTECTED (dashboard layout only) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
