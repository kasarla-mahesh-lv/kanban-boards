import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaPhone,
  FaEnvelope,
  FaSignInAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  loginApi,
  registerApi,
  sendOtpApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../components/Api/ApiService";
import "./Login.css";

type Props = {
  onClose?: () => void;
};

type Mode = "login" | "register" | "forgot";

const OTP_DURATION = 120; // ⏱ 2 minutes

const Login = ({ onClose }: Props) => {
  const nav = useNavigate();

  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  // 🔐 OTP
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // ⏱ seconds

  const [loading, setLoading] = useState(false);

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    console.log("click");
    
    if (!email || !password) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi({ email, password });
      localStorage.setItem("token", res.token);
      toast.success("Login successful ✅");
      onClose?.();
      nav("/", { replace: true });
    } catch {
      toast.error("Invalid details ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SEND OTP ---------------- */
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Enter email first ❌");
      return;
    }

    try {
      await sendOtpApi({ email });
      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      setOtpTimer(OTP_DURATION); // ⏱ start timer
      toast.success("OTP sent 📩");
    } catch {
      toast.error("Failed to send OTP ❌");
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter OTP ❌");
      return;
    }

    if (otpTimer <= 0) {
      toast.error("OTP expired ❌");
      return;
    }

    try {
      await verifyOtpApi({ email, otp });
      setOtpVerified(true);
      toast.success("OTP verified ✅");
    } catch {
      toast.error("Invalid OTP ❌");
    }
  };

  /* ---------------- REGISTER ---------------- */
  const handleRegister = async () => {
    console.log("handle---------")
    if (!name || !email || !password || !mobilenumber) {
      toast.error("All fields required ❌");
      return;
    }

    if (!otpVerified) {
      toast.error("Please verify OTP ❌");
      return;
    }

    try {
      setLoading(true);
      await registerApi({ name, email, password, mobilenumber });
      toast.success("Register successful 🎉");
      resetAll();
      setMode("login");
    } catch {
      toast.error("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET PASSWORD ---------------- */
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields required ❌");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    if (!otpVerified) {
      toast.error("Verify OTP first ❌");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordApi({ email, password });
      toast.success("Password reset successful 🔐");
      resetAll();
      setMode("login");
    } catch {
      toast.error("Reset failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMobilenumber("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setOtpTimer(0);
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        {onClose && <span className="close-btn" onClick={onClose}>✕</span>}

        <h2>
          {mode === "login" && "Welcome Back"}
          {mode === "register" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {/* NAME */}
        {mode === "register" && (
          <div className="input-box">
            <FaUser className="input-icon" />
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* EMAIL + OTP */}
        <div className="input-box otp-box">
          <FaEnvelope className="input-icon" />
          <input
            placeholder="Email"
            value={email}
            disabled={otpSent}
            onChange={(e) => setEmail(e.target.value)}
          />
          {mode !== "login" && !otpSent && (
            <button className="otp-btn" onClick={handleSendOtp}>
              Send OTP
            </button>
          )}
        </div>

        {/* OTP INPUT */}
        {mode !== "login" && otpSent && !otpVerified && (
          <>
            <div className="input-box otp-box">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button className="otp-btn" onClick={handleVerifyOtp}>
                Verify
              </button>
            </div>

            <p className="otp-timer">
              {otpTimer > 0
                ? `⏱ OTP expires in ${formatTime(otpTimer)}`
                : "OTP expired. Resend OTP"}
            </p>

            {otpTimer <= 0 && (
              <button className="resend-btn" onClick={handleSendOtp}>
                Resend OTP
              </button>
            )}
          </>
        )}

        {otpVerified && <p className="otp-success">✅ OTP Verified</p>}

        {/* PASSWORD */}
        {(mode === "login" || mode === "register" || (mode === "forgot" && otpVerified)) && (
          <div className="input-box">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder={mode === "forgot" ? "New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {/* CONFIRM PASSWORD */}
        {mode === "forgot" && otpVerified && (
          <div className="input-box">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Re-enter Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {/* MOBILE */}
        {mode === "register" && (
          <div className="input-box">
            <FaPhone className="input-icon" />
            <input
              placeholder="Mobile Number"
              value={mobilenumber}
              onChange={(e) => setMobilenumber(e.target.value)}
            />
          </div>
        )}

        {/* BUTTON */}
        <button
          className="login-btn"
          disabled={loading}
          onClick={
            mode === "login"
              ? handleLogin
              : mode === "register"
              ? handleRegister
              : handleResetPassword
          }
        >
          <FaSignInAlt />
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : mode === "register"
            ? "Register"
            : "Reset Password"}
        </button>

        {/* LINKS */}
        <p className="switch-text">
          {mode === "login" && (
            <>
              Don’t have an account?
              <span onClick={() => setMode("register")}> Register</span>
              <br />
              <span onClick={() => setMode("forgot")}>Forgot Password?</span>
            </>
          )}

          {mode !== "login" && (
            <span onClick={() => setMode("login")}>Back to Login</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
