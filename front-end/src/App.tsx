// import "./App.css";

import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import Dashboard from "./components/dashboard/Dashboard";

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="right-container">
        <Topbar />
        <Taskbar />
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
