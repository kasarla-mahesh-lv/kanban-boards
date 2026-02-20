// front-end/src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaPhone,
  FaEnvelope,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  registerApi,
  verifyOtpApi,
  resetPasswordApi,
  loginApi,
  forgotPasswordApi,
  //verifyMfaOtpApi,
} from "../components/Api/ApiCommon";
import "./Login.css";
<<<<<<< Updated upstream
=======
import { loginApi } from "../components/Api/ApiCommon";
>>>>>>> Stashed changes

type Props = {
  onClose?: () => void;
};

<<<<<<< Updated upstream
type Mode = "login" | "register" | "forgot" | "loginOtp" | "mfaVerification";

interface LoginResponse {
  mfaEnabled?: boolean;
  message?: string;
  requiresMfa?: boolean;
  token?: string;
  mfaRequired?: boolean;
  requiresOtp?: boolean;
  otpSent?: boolean;

  user?: {
    id: string;
    name?: string;
    email: string;
    mfaEnabled?: boolean;
  };
}

interface VerifyOtpResponse {
  mfaEnabled?: boolean;
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    mfaEnabled?: boolean;
  };
}

/*interface MfaVerifyResponse {
  message: string;
  mfaEnabled: boolean;
  success?: boolean;
  token?: string;
}*/
=======
type Mode = "login" | "register" | "forgot" | "loginOtp";
>>>>>>> Stashed changes

const OTP_DURATION = 120;

const Login = ({ onClose }: Props) => {
  const nav = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [, setMfaRequired] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loginToken, setLoginToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ================= VALIDATIONS ================= */
  const isStrongPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password);

  const isValidMobile = mobilenumber.length === 10;
  const isValidOtp = (otp: string) => /^\d{6}$/.test(otp);

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

<<<<<<< Updated upstream
  /* ================= AUTO FOCUS OTP INPUT ================= */
  useEffect(() => {
    if (mode === 'loginOtp' || mode === 'mfaVerification' || 
        (mode === 'register' && otpSent) || (mode === 'forgot' && otpSent)) {
      const timer = setTimeout(() => {
        const otpInput = document.querySelector('input[placeholder*="OTP"]') as HTMLInputElement;
        if (otpInput) {
          otpInput.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mode, otpSent]);

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  /* ================= KEYBOARD HANDLER ================= */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      if (mode === 'login') {
        handleLogin();
      } else if (mode === 'register' && !otpSent) {
        handleRegister();
      } else if (mode === 'loginOtp') {
        handleVerifyLoginOtp();
      } else if (mode === 'mfaVerification') {
        handleVerifyMfaOtp();
      } else if (mode === 'forgot') {
        if (!otpSent) {
          handleSendForgotOtp();
        } else {
          handleResetPassword();
        }
      }
    }
  };

  /* ================= LOGIN ================= */
=======
  /* ================= LOGIN WITH OTP ================= */
>>>>>>> Stashed changes
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("All fields required ❌");
      return;
    }

    try {
      setLoading(true);
<<<<<<< Updated upstream
      console.log("Attempting login with:", { email });
      
      const loginResponse = await loginApi({ email, password }) as LoginResponse;
      
      console.log("Login response received:", loginResponse);
      
      // Check if login was successful with token (MFA disabled)
      if (loginResponse.token) {
        console.log("Login successful with token - MFA disabled");
        toast.success("Login successful ✅");
        
        // Store token
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('token', loginResponse.token);
        sessionStorage.setItem('token', loginResponse.token);
        localStorage.setItem('userEmail', email);
        
        // Store user data with MFA status
        if (loginResponse.user) {
          const userData = {
            ...loginResponse.user,
            mfaEnabled: false
          };
          localStorage.setItem('user', JSON.stringify(userData));
          console.log("User data saved:", userData);
        }
        
        resetAll();
        onClose?.();
        nav("/", { replace: true });
        return;
      }
      
     // Check if MFA is required (user has MFA enabled)
if (loginResponse.mfaRequired === true || 
    (loginResponse.message && loginResponse.message.includes("OTP"))) {
  console.log("MFA required - OTP sent to email");
  setMfaRequired(true);
  setMode("mfaVerification");
  setOtpSent(true);
  setOtpTimer(OTP_DURATION);
  toast.success("MFA required. OTP sent to your email 📩");
  return;
}

// Check if OTP is required (login with OTP flow)
if (loginResponse.requiresOtp || loginResponse.otpSent) {
  console.log("OTP required for login");
  setMode("loginOtp");
  setOtpSent(true);
  setOtpTimer(OTP_DURATION);
  toast.success("OTP sent to your email 📩");
  return;
}
      
      // If we get here, something unexpected happened
      console.log("Unexpected login response:", loginResponse);
      toast.error(loginResponse.message || "Login failed - unexpected response");
      
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle specific error messages
      if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid email or password ❌");
      } else if (error.response?.status === 401) {
        toast.error(error.response?.data?.message || "Please verify your email first ❌");
      } else if (error.response?.status === 404) {
        toast.error("User not found ❌");
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Login failed ❌");
      }
=======
      // First attempt login to get token
      const res = await loginApi({ email, password });
      console.log(res, "res--------------------");
      
      // Store token temporarily
      setLoginToken(res.token);
      
      // Send OTP to email
      await sendOtpApi({ email });
      
      // Switch to OTP verification mode
      setMode("loginOtp");
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent to your email 📩");
      
    } catch {
      toast.error("Invalid credentials ❌");
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
      // Verify OTP
      await verifyOtpApi({ email, otp });
      
      // Store the token that we got from login
      localStorage.setItem("token", loginToken);
      localStorage.setItem("user", JSON.stringify({ email }));
      
      toast.success("Login successful ✅");
      resetAll();
      onClose?.();
      nav("/", { replace: true });
    } catch {
      toast.error("Invalid OTP ❌");
>>>>>>> Stashed changes
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY LOGIN OTP ================= */
  const handleVerifyLoginOtp = async () => {
    if (!isValidOtp(otp)) {
      toast.error("Please enter a valid 6-digit OTP ❌");
      return;
    }

    if (otpTimer <= 0) {
      toast.error("OTP expired ❌");
      return;
    }

    try {
      setLoading(true);
      console.log("Verifying login OTP:", { email, otp });
      
      const response = await verifyOtpApi({
        email,
        otp,
        type: "login"
      }) as VerifyOtpResponse;
      
      console.log("Login OTP verification response:", response);
      
      if (response.token || response.success) {
        toast.success("Login successful ✅");
        
        const token = response.token || localStorage.getItem('token');
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
        }
        
        localStorage.setItem('userEmail', email);
        
        // Store user data with MFA status
        if (response.user) {
          const userData = {
            ...response.user,
            mfaEnabled: false
          };
          localStorage.setItem('user', JSON.stringify(userData));
          console.log("User data saved:", userData);
        }
        
        resetAll();
        onClose?.();
        nav("/", { replace: true });
      } else {
        toast.error("No token received from server");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY MFA OTP ================= */
const handleVerifyMfaOtp = async () => {
  if (!isValidOtp(otp)) {
    toast.error("Please enter a valid 6-digit OTP ❌");
    return;
  }

  if (otpTimer <= 0) {
    toast.error("OTP expired ❌");
    return;
  }

  try {
    setLoading(true);
    console.log("Verifying MFA login OTP:", { email, otp });
    
    // IMPORTANT: For login with MFA, use verifyOtpApi with type "login"
    // NOT verifyMfaOtpApi (which is for enabling MFA in settings)
    const response = await verifyOtpApi({
      email,
      otp,
      type: "login"
    }) as VerifyOtpResponse;
    
    console.log("MFA login verification response:", response);
    
    if (response.token || response.success) {
      toast.success("Login successful ✅");
      
      const token = response.token || localStorage.getItem('token');
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
      }
      
      localStorage.setItem('userEmail', email);
      
      // Set MFA as enabled in user data
      const userData: any = {
        email: email,
        mfaEnabled: true
      };
      
      if (response.user) {
        userData.id = response.user.id || '';
        userData.name = response.user.name || '';
      } else {
        const existingUserStr = localStorage.getItem('user');
        if (existingUserStr) {
          try {
            const existingUser = JSON.parse(existingUserStr);
            userData.id = existingUser.id || '';
            userData.name = existingUser.name || '';
          } catch (e) {
            console.error("Failed to parse existing user data:", e);
          }
        }
      }
      
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("User data saved with MFA enabled:", userData);
      
      resetAll();
      onClose?.();
      nav("/", { replace: true });
    } else {
      toast.error("Invalid response from server");
    }
  } catch (error: any) {
    console.error("MFA login verification error:", error);
    
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      setMode("login");
    } else if (error.response?.status === 400) {
      toast.error(error.response?.data?.message || "Invalid OTP ❌");
    } else {
      toast.error(error?.response?.data?.message || error?.message || "Invalid OTP ❌");
    }
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
<<<<<<< Updated upstream
      await registerApi({ name, email, password, mobilenumber });
      
      // Send OTP
      await forgotPasswordApi({ email });
      
=======
            await registerApi({ name, email, password, mobilenumber });
    
      // await sendOtpApi({ email });
>>>>>>> Stashed changes
      setOtpSent(true);
      setOtpTimer(OTP_DURATION);
      toast.success("OTP sent to email 📩");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY REGISTER OTP ================= */
  const handleVerifyOtpAndRegister = async () => {
    if (!isValidOtp(otp)) {
      toast.error("Please enter a valid 6-digit OTP ❌");
      return;
    }

    if (otpTimer <= 0) {
      toast.error("OTP expired ❌");
      return;
    }

    try {
      setLoading(true);
<<<<<<< Updated upstream
      await verifyOtpApi({
        email,
        otp,
        type: "register"
      });
      
      toast.success("Registration successful 🎉");
      resetAll();
      setMode("login");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error?.response?.data?.message || error?.message || "OTP verification failed ❌");
=======
      await verifyOtpApi({ email, otp });
      // await registerApi({ name, email, password, mobilenumber });
      toast.success("Registration successful 🎉");
      resetAll();
      setMode("login");
    } catch {
      toast.error("User already exists ❌");
>>>>>>> Stashed changes
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
      console.error("Forgot password error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Email not registered ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isValidOtp(otp)) {
      toast.error("Please enter a valid 6-digit OTP ❌");
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
      await resetPasswordApi({
        email,
        otp,
        newPassword: password,
        confirmPassword: confirmPassword
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
<<<<<<< Updated upstream
    setMfaRequired(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
=======
    setLoginToken("");
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      await sendOtpApi({ email });
      setOtpTimer(OTP_DURATION);
      toast.success("OTP resent 📩");
    } catch {
      toast.error("Failed to resend OTP ❌");
    } finally {
      setLoading(false);
    }
>>>>>>> Stashed changes
  };

  const resendOtp = async () => {
    try {
      setLoading(true);

      if (mode === "loginOtp" || mode === "mfaVerification") {
        await loginApi({ email, password });
      } else if (mode === "forgot") {
        await forgotPasswordApi({ email });
      } else {
        await forgotPasswordApi({ email });
      }

      setOtpTimer(OTP_DURATION);
      toast.success("OTP resent successfully 📩");
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to resend OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <span className="spinner"></span>
  );

  return (
    <div className="login-overlay">
      <div className="login-card">
        {onClose && <span className="close-btn" onClick={onClose}>✕</span>}

        <h2>
          {mode === "login" && "Welcome Back"}
<<<<<<< Updated upstream
          {mode === "loginOtp" && "Verify Login OTP"}
          {mode === "mfaVerification" && "MFA Verification"}
=======
          {mode === "loginOtp" && "Verify OTP"}
>>>>>>> Stashed changes
          {mode === "register" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h2>

        {/* ================= REGISTER ================= */}
        {mode === "register" && !otpSent && (
          <>
            <div className="input-box">
              <FaUser className="input-icon" />
<<<<<<< Updated upstream
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
=======
              <input 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
>>>>>>> Stashed changes
              />
            </div>

            <div className="input-box">
              <FaEnvelope className="input-icon" />
<<<<<<< Updated upstream
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
=======
              <input 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
>>>>>>> Stashed changes
              />
            </div>

            <div className="input-box password-box">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            {mobilenumber && !isValidMobile && (
              <p className="hint-text">Enter valid 10-digit mobile number</p>
            )}

            <button className="login-btn" onClick={handleRegister} disabled={loading}>
<<<<<<< Updated upstream
              {loading ? (
                <>
                  <LoadingSpinner />
                  Sending OTP...
                </>
              ) : (
                "Register"
              )}
=======
              {loading ? "Sending OTP..." : "Register"}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              <input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                onKeyPress={handleKeyPress}
                disabled={loading}
=======
              <input 
                placeholder="Enter OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
>>>>>>> Stashed changes
              />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>
            
            {otpTimer === 0 && (
              <button className="resend-btn" onClick={resendOtp} disabled={loading}>
<<<<<<< Updated upstream
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  "Resend OTP"
                )}
=======
                Resend OTP
>>>>>>> Stashed changes
              </button>
            )}

            <button 
              className="login-btn" 
              onClick={handleVerifyOtpAndRegister}
<<<<<<< Updated upstream
              disabled={loading || otpTimer <= 0 || !isValidOtp(otp)}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Verifying...
                </>
              ) : (
                "Verify OTP & Register"
              )}
=======
              disabled={loading || otpTimer <= 0}
            >
              {loading ? "Verifying..." : "Verify OTP & Register"}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
=======
              <input 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
>>>>>>> Stashed changes
              />
            </div>

            <div className="input-box password-box">
              <FaLock className="input-icon" />
<<<<<<< Updated upstream
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner />
                  Checking...
                </>
              ) : (
                <>
                  <FaSignInAlt /> Login
                </>
              )}
=======
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              <FaSignInAlt /> {loading ? "Sending OTP..." : "Login"}
>>>>>>> Stashed changes
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
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>

            {otpTimer === 0 && (
              <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </button>
            )}

            <button
              className="login-btn"
              onClick={handleVerifyLoginOtp}
              disabled={loading || otpTimer <= 0 || !isValidOtp(otp)}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            <p className="switch-text">
              <span onClick={() => {
                resetAll();
                setMode("login");
              }}>← Back to Login</span>
            </p>
          </>
        )}

        {/* ================= MFA VERIFICATION ================= */}
        {mode === "mfaVerification" && (
          <>
            <div className="info-text">
              <p>MFA verification required</p>
              <p style={{ fontSize: "14px", marginTop: "5px" }}>
                OTP sent to {email}
              </p>
            </div>

            <div className="input-box">
              <input 
                placeholder="Enter 6-digit MFA OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
                maxLength={6}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>
            
            {otpTimer === 0 && (
              <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </button>
            )}

            <button 
              className="login-btn" 
              onClick={handleVerifyMfaOtp}
              disabled={loading || otpTimer <= 0 || !isValidOtp(otp)}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Verifying...
                </>
              ) : (
                "Verify MFA & Login"
              )}
            </button>

            <p className="switch-text">
              <span onClick={() => {
                resetAll();
                setMode("login");
              }}>← Back to Login</span>
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
                placeholder="Enter OTP" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                maxLength={6}
              />
            </div>

            <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>
            
            {otpTimer === 0 && (
              <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                Resend OTP
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
        {mode === "forgot" && !otpSent && (
          <>
            <div className="input-box">
              <FaEnvelope className="input-icon" />
<<<<<<< Updated upstream
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            {!otpSent ? (
              <button className="login-btn" onClick={handleSendForgotOtp} disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
=======
              <input 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {!otpSent && (
              <button className="login-btn" onClick={handleSendForgotOtp} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
>>>>>>> Stashed changes
              </button>
            ) : (
              <>
<<<<<<< Updated upstream
                <div className="info-text">
                  <p>OTP sent to {email}</p>
=======
                <div className="input-box">
                  <input 
                    placeholder="OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                  />
>>>>>>> Stashed changes
                </div>

                <div className="input-box">
                  <input
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>

                <div className="input-box password-box">
                  <FaLock className="input-icon" />
<<<<<<< Updated upstream
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
=======
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
>>>>>>> Stashed changes
                </div>

            <div className="input-box">
              <input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>

                <div className="input-box password-box">
                  <FaLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <p className="otp-timer">⏱ OTP expires in {formatTime(otpTimer)}</p>

                {otpTimer === 0 && (
                  <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                    {loading ? (
                      <>
                        <LoadingSpinner />
                        Sending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                )}

<<<<<<< Updated upstream
                <button
                  className="login-btn"
                  onClick={handleResetPassword}
                  disabled={loading || otpTimer <= 0 || !isValidOtp(otp) || !password || !confirmPassword}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
=======
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

                <button 
                  className="login-btn" 
                  onClick={handleResetPassword}
                  disabled={loading || otpTimer <= 0}
                >
                  {loading ? "Resetting..." : "Reset Password"}
>>>>>>> Stashed changes
                </button>
              </>
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

<<<<<<< Updated upstream
export default Login;










=======
export default Login;
>>>>>>> Stashed changes
