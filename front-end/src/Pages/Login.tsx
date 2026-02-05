import { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { loginApi } from "../components/Api/ApiService";
import "./Login.css";

type Props = {
  onClose: () => void;
};

const LoginForm = ({ onClose }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email) return setError("Email is required");
    if (!password) return setError("Password is required");

    try {
      setLoading(true);

      const res = await loginApi({ email, password });

      // 🔐 Store JWT
      localStorage.setItem("token", res.token);

      onClose();
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <span className="close-btn" onClick={onClose}>✕</span>

        <h2>Welcome Back</h2>
        <p>Please login to your account</p>

        {error && <p className="error-text">{error}</p>}

        <div className="input-box">
          <FaUser className="input-icon" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-box">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          <FaSignInAlt />
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
