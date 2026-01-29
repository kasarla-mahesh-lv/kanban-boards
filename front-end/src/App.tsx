import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
