import React from "react";
import "./App.css";
import Header from "./components/layout/Header";

const App: React.FC = () => {
  return (
    <div className="app-container">
     
      <Header />

      {/* Main Content */}
      {/* <main className="main-content">
        <h1>Dashboard</h1>
        <p>Welcome to your project management system 🚀</p>
      </main> */}
    </div>
  );
};

export default App;
