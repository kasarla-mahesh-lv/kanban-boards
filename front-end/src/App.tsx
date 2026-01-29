import './App.css'
import Dashboard from './components/dashboard/Dashboard'
import Sidebar from './components/layout/Sidebar'
const App: React.FC = () => {
  return (

    <>

   <div className="app-container">
      {/* LEFT */}
      <Sidebar />

      {/* RIGHT */}
      <div className="right-container">
        
        <Dashboard />
      </div>
    </div>
   
    </>
  )
}

export default App