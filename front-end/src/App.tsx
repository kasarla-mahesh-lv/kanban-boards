import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboards/Dashboard";
import ProjectsPage from "./Pages/ProjectsPage";
import BoardPage from "./Pages/BoardPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* LEFT */}
        <Sidebar />

        {/* RIGHT (changes dynamically) */}
        <div className="right-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<BoardPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
