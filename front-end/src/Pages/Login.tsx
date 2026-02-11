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
  registerApi,
  sendOtpApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../components/Api/ApiService";
import "./Login.css";
import { loginApi } from "../components/Api/ApiCommon"

type Props = {
  onClose?: () => void;
};

type Mode = "login" | "register" | "forgot";

const OTP_DURATION = 120;

const Login = ({ onClose }: Props) => {
  const nav = useNavigate();

  const [mode, setMode] = useState<Mode>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const [loading, setLoading] = useState(false);

  /* ================= VALIDATIONS ================= */
  const isStrongPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password);

  const isValidMobile = mobilenumber.length === 10;

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

  /* ================= MOBILE ================= */
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setMobilenumber(value);
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi({ email, password });
      console.log(res,"res--------------------");
      
      // localStorage.setItem("token", res.token);
      toast.success("Login successful ✅");
      onClose?.();
      nav("/", { replace: true });
    } catch {
      toast.error("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (!name || !email || !password || !mobilenumber) {
      toast.error("All fields required ❌");
      return;
    }

    if (!isStrongPassword) {
      toast.error("Password is too weak ❌");
      return;
    }

    if (!isValidMobile) {
      toast.error("Mobile number must be 10 digits ❌");
      return;
    }

    try {
      setLoading(true);
      await sendOtpApi({ email });
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent to email 📩");
    } catch {
      toast.error("User already exists ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtpAndRegister = async () => {
    if (!otp) {
      toast.error("Enter OTP ❌");
      return;
    }

    if (otpTimer <= 0) {
      toast.error("OTP expired ❌");
      return;
    }

    try {
      setLoading(true);
      await verifyOtpApi({ email, otp });
      await registerApi({ name, email, password, mobilenumber });
      toast.success("Registration successful 🎉");
      resetAll();
      setMode("login");
    } catch {
      toast.error("user already exists ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORGOT PASSWORD ================= */
  const handleSendForgotOtp = async () => {
    if (!email) {
      toast.error("Enter email ❌");
      return;
    }

    try {
      await sendOtpApi({ email });
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent 📩");
    } catch {
      toast.error("Email not registered ❌");
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields required ❌");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    if (!isStrongPassword) {
      toast.error("Password is too weak ❌");
      return;
    }

    try {
      setLoading(true);
      await verifyOtpApi({ email, otp });
      await resetPasswordApi({ email, password });
      toast.success("Password reset successful 🔐");
      resetAll();
      setMode("login");
    } catch {
      toast.error("Invalid OTP ❌");
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

        {/* ================= REGISTER ================= */}
        {mode === "register" && !otpSent && (
          <>
            <div className="input-box">
              <FaUser className="input-icon" />
              <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
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

            {password && !isStrongPassword && (
              <p className="hint-text">
                Use 8+ chars with Upper, Lower, Number & Special char
              </p>
            )}

            <div className="input-box">
              <FaPhone className="input-icon" />
              <input
                placeholder="Mobile Number"
                value={mobilenumber}
                onChange={handleMobileChange}
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            {mobilenumber && !isValidMobile && (
              <p className="hint-text">Enter valid 10-digit mobile number</p>
            )}

            <button className="login-btn" onClick={handleRegister}>
              Register
            </button>

            {/* ✅ BACK TO LOGIN LINK */}
            <p className="switch-text">
              <span onClick={() => setMode("login")}>← Back to Login</span>
            </p>
          </>
        )}

        {/* ================= REGISTER OTP ================= */}
        {mode === "register" && otpSent && (
          <>
            <div className="input-box">
              <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>

            <button className="login-btn" onClick={handleVerifyOtpAndRegister}>
              Verify OTP & Register
            </button>
          </>
        )}

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input-box">
              <FaLock className="input-icon" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button className="login-btn" onClick={handleLogin}>
              <FaSignInAlt /> Login
            </button>

            <p className="switch-text">
              Don’t have an account?
              <span onClick={() => setMode("register")}> Register</span>
              <br />
              <span onClick={() => setMode("forgot")}>Forgot Password?</span>
            </p>
          </>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {mode === "forgot" && (
          <>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {!otpSent && (
              <button className="login-btn" onClick={handleSendForgotOtp}>
                Send OTP
              </button>
            )}

            {otpSent && (
              <>
                <div className="input-box">
                  <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>

                <div className="input-box">
                  <FaLock className="input-icon" />
                  <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                {password && !isStrongPassword && (
                  <p className="hint-text">
                    Use 8+ chars with Upper, Lower, Number & Special char
                  </p>
                )}

                <div className="input-box">
                  <FaLock className="input-icon" />
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <button className="login-btn" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </>
            )}

            <p className="switch-text">
              <span onClick={() => setMode("login")}>Back to Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
