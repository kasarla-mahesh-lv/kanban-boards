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

import "./App.css";

/* ================= APP LAYOUT ================= */
const AppLayout: React.FC = () => {

  const location = useLocation();

  const showTaskbar = location.pathname === "/";

  return (
    <div className="app-layout">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="right-container">

        {/* TOPBAR */}
        <Topbar />

        {/* TASKBAR ONLY DASHBOARD */}
        {showTaskbar && <Taskbar />}

        {/* PAGE ROUTES */}
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
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
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
