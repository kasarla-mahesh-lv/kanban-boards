import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../Pages/Login.css";
import { toast } from "react-toastify";
import { registerApi } from "../Api/ApiCommon";
const Register: React.FC = () => {
  const nav = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");  

      console.log("register");
      return true;
      await registerApi({ name, email, password, mobilenumber });

      toast.success("register sucessful");
      nav("/login", { replace: true });
    } catch (error: any) {
      toast.error("invalid details");
      setErr(error?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Create Account</h2>
        <p className="sub">Register to continue.</p>

        {err && <div className="auth-error">{err}</div>}

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <label>Mobile Number</label>
        <input type="tel" value={mobilenumber} onChange={(e) => setMobilenumber(e.target.value)} required />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="auth-foot">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
