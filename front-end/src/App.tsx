import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";

import Dashboard from "./components/dashboard/Dashboard";
import History from "./components/History";
import Reports from "./Pages/Reports";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Pages/Login";

import "./App.css";
import NotificationPage from "./components/notifications/NotificationPage";

/* ================= APP LAYOUT ================= */
const AppLayout: React.FC = () => {

  const location = useLocation();

  
  const showTaskbar = location.pathname === "/";

  return (
    <div className="app-layout">
  
      <Sidebar />

      
      <div className="right-container">

        {/* TOPBAR */}
        <Topbar />

        
        {showTaskbar && <Taskbar />}

        {/* PAGE ROUTES */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<NotificationPage />} />
            {/* <Route path="/projects/:projectId" element={<ProjectDetails />} /> */}
            <Route path="/login" element={<Login onClose={() => {}} />} />
          </Routes>
        </div>

      </div>

      {/* ⭐ TOAST CONTAINER GLOBAL */}
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
