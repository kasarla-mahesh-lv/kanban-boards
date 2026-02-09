import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaPhone,
  FaEnvelope,
  FaSignInAlt,
} from "react-icons/fa";

import { toast } from "react-toastify";
import { loginApi, registerApi } from "../components/Api/ApiService";
import "./Login.css";

type Props = {
  onClose?: () => void; // ✅ optional (so page mode also works)
};

const Login = ({ onClose }: Props) => {
  const nav = useNavigate(); // ✅ ADD

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  const [loading, setLoading] = useState(false);

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ email, password });

      // ✅ store token
      localStorage.setItem("token", res.token);

      toast.success("login sucessfull");

      // ✅ close modal if exists
      if (onClose) onClose();

      // ✅ go to dashboard
      setTimeout(() => {
        nav("/", { replace: true });
      }, 600);
    } catch {
      toast.error("invalid details");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async () => {
    if (!name || !email || !password || !mobilenumber) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      setLoading(true);

      // ✅ Register API
      await registerApi({
        name,
        email,
        password,
        mobilenumber,
      });

      toast.success("register sucessful");

      // ✅ After register -> switch to login
      setIsLogin(true);

      // Optional: clear fields
      setPassword("");
    } catch {
      toast.error("invalid details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        {/* ✅ Close button only if modal */}
        {onClose && (
          <span className="close-btn" onClick={onClose}>
            ✕
          </span>
        )}

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {!isLogin && (
          <div className="input-box">
            <FaUser className="input-icon" />
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="input-box">
          <FaEnvelope className="input-icon" />
          <input
            placeholder="Email"
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

        {!isLogin && (
          <div className="input-box">
            <FaPhone className="input-icon" />
            <input
              placeholder="Mobile Number"
              value={mobilenumber}
              onChange={(e) => setMobilenumber(e.target.value)}
            />
          </div>
        )}

        <button
          className="login-btn"
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={loading}
        >
          <FaSignInAlt />
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

