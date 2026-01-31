import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-layout ">
      <Sidebar />

      <div className="right-container" >
        <div className="content-container ">
          <Topbar />
          <Taskbar />
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export default App;