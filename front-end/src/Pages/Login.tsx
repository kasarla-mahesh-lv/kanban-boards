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
  verifyOtpApi,
  resetPasswordApi,
  loginApi,
  forgotPasswordApi,
} from "../components/Api/ApiCommon";
import "./Login.css";

type Props = {
  onClose?: () => void;
};

type Mode = "login" | "register" | "forgot" | "loginOtp";

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

  /* ================= LOGIN WITH OTP ================= */
  const handleLogin = async () => {
    console.log("email");
    
    if (!email || !password) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      setLoading(true);
      await loginApi({ email, password });
      setMode("loginOtp");
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent to your email 📩");
    } catch (error: any) {
      toast.error(error?.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY LOGIN OTP ================= */
  const handleVerifyLoginOtp = async () => {
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
      await verifyOtpApi({ 
        email, 
        otp, 
        type: "login" 
      });
      toast.success("Login successful ✅");
      resetAll();
      onClose?.();
      nav("/", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Invalid OTP ❌");
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
      await registerApi({ name, email, password, mobilenumber });
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent to email 📩");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY REGISTER OTP ================= */
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
      await verifyOtpApi({ 
        email, 
        otp, 
        type: "register" 
      });
      toast.success("Registration successful 🎉");
      resetAll();
      setMode("login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "OTP verification failed ❌");
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
      setLoading(true);
      await forgotPasswordApi({ email });
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent to your email 📩");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Email not registered ❌");
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Added confirmPassword validation and send both password and confirmPassword
  const handleResetPassword = async () => {
    if (!otp) {
      toast.error("Enter OTP ❌");
      return;
    }

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

    if (otpTimer <= 0) {
      toast.error("OTP expired ❌");
      return;
    }

    try {
      setLoading(true);
      // Send both newPassword and confirmPassword to match backend validation
      await resetPasswordApi({ 
        email, 
        otp,
        newPassword: password,
        confirmPassword: confirmPassword  // Added confirmPassword
      });
      toast.success("Password reset successful 🔐");
      resetAll();
      setMode("login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Password reset failed ❌");
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

  const resendOtp = async () => {
    try {
      setLoading(true);
      
      if (mode === "loginOtp") {
        await loginApi({ email, password });
      } else if (mode === "forgot") {
        await forgotPasswordApi({ email });
      } else {
        await registerApi({ name, email, password, mobilenumber });
      }
      
      setOtpTimer(OTP_DURATION);
      toast.success("OTP resent successfully 📩");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to resend OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        {onClose && <span className="close-btn" onClick={onClose}>✕</span>}

        <h2>
          {mode === "login" && "Welcome Back"}
          {mode === "loginOtp" && "Verify OTP"}
          {mode === "register" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {/* ================= REGISTER ================= */}
        {mode === "register" && !otpSent && (
          <>
            <div className="input-box">
              <FaUser className="input-icon" />
              <input 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input 
                type="email"
                placeholder="Email Address" 
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

            <button className="login-btn" onClick={handleRegister} disabled={loading}>
              {loading ? "Sending OTP..." : "Register"}
            </button>

            <p className="switch-text">
              <span onClick={() => {
                resetAll();
                setMode("login");
              }}>← Back to Login</span>
            </p>
          </>
        )}

        {/* ================= REGISTER OTP ================= */}
        {mode === "register" && otpSent && (
          <>
            <div className="info-text">
              <p>OTP sent to {email}</p>
            </div>

            <div className="input-box">
              <input 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength={6}
              />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>
            
            {otpTimer === 0 && (
              <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            )}

            <button 
              className="login-btn" 
              onClick={handleVerifyOtpAndRegister}
              disabled={loading || otpTimer <= 0 || !otp}
            >
              {loading ? "Verifying..." : "Verify OTP & Register"}
            </button>

            <p className="switch-text">
              <span onClick={() => {
                resetAll();
                setMode("register");
              }}>← Back to Registration</span>
            </p>
          </>
        )}

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input 
                type="email"
                placeholder="Email Address" 
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

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              <FaSignInAlt /> {loading ? "Sending OTP..." : "Login"}
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <span onClick={() => {
                resetAll();
                setMode("register");
              }}>Register</span>
              <br />
              <span onClick={() => {
                resetAll();
                setMode("forgot");
              }}>Forgot Password?</span>
            </p>
          </>
        )}

        {/* ================= LOGIN OTP VERIFICATION ================= */}
        {mode === "loginOtp" && (
          <>
            <div className="info-text">
              <p>OTP sent to {email}</p>
            </div>

            <div className="input-box">
              <input 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength={6}
              />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>
            
            {otpTimer === 0 && (
              <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            )}

            <button 
              className="login-btn" 
              onClick={handleVerifyLoginOtp}
              disabled={loading || otpTimer <= 0 || !otp}
            >
              {loading ? "Verifying..." : "Verify OTP & Login"}
            </button>

            <p className="switch-text">
              <span onClick={() => {
                resetAll();
                setMode("login");
              }}>← Back to Login</span>
            </p>
          </>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {mode === "forgot" && (
          <>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
              <input 
                type="email"
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {!otpSent ? (
              <button className="login-btn" onClick={handleSendForgotOtp} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            ) : (
              <>
                <div className="info-text">
                  <p>OTP sent to {email}</p>
                </div>

                <div className="input-box">
                  <input 
                    placeholder="Enter 6-digit OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    maxLength={6}
                  />
                </div>

                <div className="input-box">
                  <FaLock className="input-icon" />
                  <input 
                    type="password" 
                    placeholder="New Password" 
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
                  <FaLock className="input-icon" />
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                </div>

                <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>

                {otpTimer === 0 && (
                  <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                    {loading ? "Sending..." : "Resend OTP"}
                  </button>
                )}

                <button 
                  className="login-btn" 
                  onClick={handleResetPassword}
                  disabled={loading || otpTimer <= 0 || !otp || !password || !confirmPassword}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}

            <p className="switch-text">
              <span onClick={() => {
                resetAll();
                setMode("login");
              }}>← Back to Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;