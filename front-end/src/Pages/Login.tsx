import { useState } from "react";
import {
  FaUser,
  FaLock,
  FaPhone,
  FaEnvelope,
  FaSignInAlt
} from "react-icons/fa";

import { toast } from "react-toastify";
import { loginApi, registerApi } from "../components/Api/ApiService";
import "./Login.css";

type Props = {
  onClose: () => void;
};

const Login = ({ onClose }: Props) => {

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

      localStorage.setItem("token", res.token);

      console.log("Login Successful");

      // ✅ Toast success
      toast.success("Login Successful 🎉");

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch {
      toast.error("Invalid email or password ❌");
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

      await registerApi({
        name,
        email,
        password,
        mobilenumber
      });

      toast.success("Registration Successful 🎉");

      setIsLogin(true);

    } catch {
      toast.error("Registration Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">

        <span className="close-btn" onClick={onClose}>✕</span>

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
