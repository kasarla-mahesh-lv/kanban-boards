import React from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    // 🔙 Go back to previous page
    navigate(-1);
  };

  const handleLogout = () => {
    // 🧹 Clear auth data (example)
    localStorage.clear();

    // 👉 Redirect to login page
    navigate("/login");
  };

  return (
    <div className="logout-page">
      <div className="logout-card">
        <div className="logout-icon">🚪</div>
        <h2>Logout</h2>
        <p>Are you sure you want to logout from HRM?</p>

        <div className="logout-actions">
          {/* ✅ CANCEL GOES BACK */}
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
