
import Sidebar from "./components/layout/Sidebar";
import { Topbar } from "./components/Topbar";
import { Taskbar } from "./components/Taskbar";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";
import { BrowserRouter, Routes, Route,useLocation } from "react-router-dom";
import ProjectDetails from "./components/Projects/ProjectDetails";
import History from "./components/History";
import Reports from "./Pages/Reports";
import Logout from "./Pages/Logout";


const AppLayout: React.FC = () => {
  const location=useLocation();
  const showTaskbar=location.pathname==="/";
  return (
    
    
    <div className="app-layout ">
      <Sidebar />

      <div className="right-container" >
         <Topbar />
         {showTaskbar&&<Taskbar/>}

        <div className="content-container ">
         
          <Routes>
            <Route path="/" element={
           <Dashboard />}/>

           <Route path="/history" element={<History/>}/>
           <Route path="/reports" element={<Reports/>}/>
           <Route path="/logout" element={<Logout/>}/>
           <Route path="/projects/:projectId" element={<ProjectDetails/>}/>
          </Routes>
        
          
        </div>
      </div>
    </div>
    
  );
};
const App:React.FC=()=>{
  return(
    <BrowserRouter>
    <AppLayout/>
    </BrowserRouter>
  )
}

export default App;