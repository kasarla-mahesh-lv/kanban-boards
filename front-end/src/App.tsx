import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectDetails from "./components/Projects/ProjectDetails";


const App: React.FC = () => {
  return (
    <BrowserRouter>
    
    <div className="app-layout ">
      <Sidebar />

      <div className="right-container" >
        <div className="content-container ">
          <Topbar />
          <Routes>
            <Route path="/" element={<>  <Taskbar />
           <Dashboard /></>}/>
           <Route path="/projects/:projectId" element={<ProjectDetails/>}/>
          </Routes>
        
          
        </div>
      </div>
    </div>
    </BrowserRouter>
  );
};

export default App;



