import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: if you saved any login info, clear it
    localStorage.removeItem("isLoggedIn"); // if exists
    sessionStorage.clear(); // optional

    toast.success("Logout Successful");
    // No auto-redirect
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f7f8ff",
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "90%",
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>You’re logged out ✅</h2>
        <p style={{ margin: 0, color: "#666" }}>
          You have successfully logged out.
        </p>

        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
