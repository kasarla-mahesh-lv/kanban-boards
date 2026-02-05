import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import Dashboard from "./components/dashboard/Dashboard";
import NotificationPage from "./components/notifications/NotificationPage";

import { Routes, Route } from "react-router-dom";

import "./App.css";

const App: React.FC = () => {
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

export default App;
