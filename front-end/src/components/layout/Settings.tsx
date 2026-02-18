// front-end/src/components/ProjectSettings.tsx
import React, { useState, useEffect } from "react";
import { 
  requestMfaOtpApi, 
  verifyMfaOtpApi, 
  requestDisableMfaOtpApi,
  verifyDisableMfaOtpApi,
  getMfaStatusFromUser,
  updateUserMfaStatus
} from "../Api/ApiCommon";
import "./Settings.css";

interface ProjectSettingsProps {
  projectId: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  projectId,
  isOpen,
  onClose,
}) => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [otpStatus, setOtpStatus] = useState<'idle' | 'sent' | 'failed' | 'verifying'>('idle');
  const [action, setAction] = useState<'enable' | 'disable' | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Check MFA status when component opens
  useEffect(() => {
    if (isOpen) {
      checkMfaStatus();
    } else {
      // Reset state when closed
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setOtp("");
    setShowOtpInput(false);
    setOtpStatus('idle');
    setLoading(false);
    setAction(null);
    setErrorMessage("");
  };

  const checkMfaStatus = async () => {
    try {
      setInitialLoading(true);
      setErrorMessage("");
      console.log("Checking MFA status...");
      
      // Get MFA status from localStorage
      const status = getMfaStatusFromUser();
      console.log("MFA status from localStorage:", status);
      setMfaEnabled(status);
    } catch (err: any) {
      console.log("Failed to check MFA status:", err?.message);
      setErrorMessage("Failed to load MFA status");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleEnableMfa = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setAction('enable');
      console.log("Requesting MFA OTP for enabling...");
      
      const response = await requestMfaOtpApi();
      console.log("Request MFA OTP response:", response);
      
      setOtpStatus('sent');
      setShowOtpInput(true);
    } catch (err: any) {
      console.log("OTP ERROR:", err?.response?.data || err.message);
      setOtpStatus('failed');
      
      let errorMsg = err?.response?.data?.message || err.message || "Unknown error";
      if (err?.response?.status === 401) {
        errorMsg = "Session expired. Please login again.";
      } else if (err?.response?.status === 404) {
        errorMsg = "MFA endpoint not found. Please check backend configuration.";
      }
      
      setErrorMessage(errorMsg);
      setAction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setAction('disable');
      console.log("Requesting MFA OTP for disabling...");
      
      const response = await requestDisableMfaOtpApi();
      console.log("Request Disable MFA OTP response:", response);
      
      setOtpStatus('sent');
      setShowOtpInput(true);
    } catch (err: any) {
      console.log("OTP ERROR:", err?.response?.data || err.message);
      setOtpStatus('failed');
      
      let errorMsg = err?.response?.data?.message || err.message || "Unknown error";
      if (err?.response?.status === 401) {
        errorMsg = "Session expired. Please login again.";
      }
      
      setErrorMessage(errorMsg);
      setAction(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("⚠️ Please enter OTP");
      return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      alert("⚠️ Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setOtpStatus('verifying');
      console.log(`Verifying OTP for ${action} action:`, otp);
      
      // Check if we have a token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      let response;
      if (action === 'enable') {
        response = await verifyMfaOtpApi(otp);
      } else if (action === 'disable') {
        response = await verifyDisableMfaOtpApi(otp);
      } else {
        throw new Error("No action specified");
      }
      
      console.log("OTP verification response:", response);
      
      if (action === 'enable' && response.mfaEnabled === true) {
        setMfaEnabled(true);
        updateUserMfaStatus(true);
        alert("✅ MFA Enabled Successfully");
      } else if (action === 'disable' && response.mfaEnabled === false) {
        setMfaEnabled(false);
        updateUserMfaStatus(false);
        alert("✅ MFA Disabled Successfully");
      } else {
        throw new Error(`MFA ${action} failed - unexpected response: ${JSON.stringify(response)}`);
      }
      
      // Reset OTP input state
      setShowOtpInput(false);
      setOtp("");
      setOtpStatus('idle');
      setAction(null);
    } catch (err: any) {
      console.log("VERIFY ERROR:", err?.response?.data || err.message);
      setOtpStatus('failed');
      
      let errorMsg = err?.response?.data?.message || err.message || "Verification failed";
      if (err?.response?.status === 401) {
        errorMsg = "Session expired. Please login again.";
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpInput(false);
    setOtp("");
    setOtpStatus('idle');
    setAction(null);
    setErrorMessage("");
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      console.log(`Resending MFA OTP for ${action}...`);
      
      let response;
      if (action === 'enable') {
        response = await requestMfaOtpApi();
      } else if (action === 'disable') {
        response = await requestDisableMfaOtpApi();
      } else {
        throw new Error("No action specified");
      }
      
      console.log("Resend OTP response:", response);
      
      setOtpStatus('sent');
    } catch (err: any) {
      console.log("RESEND ERROR:", err?.response?.data || err.message);
      setOtpStatus('failed');
      
      const errorMsg = err?.response?.data?.message || err.message || "Failed to resend OTP";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="settings-header">
          <h2>Project Settings</h2>
          <button className="close-settings-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          
          {/* Project ID */}
          <div className="project-id-info">
            <span className="info-label">Project ID:</span>
            <span className="info-value">{projectId || "N/A"}</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MFA SECTION */}
          <div className="settings-section">
            <h3>🔐 Multi-Factor Authentication (MFA)</h3>

            {initialLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading MFA status...</p>
              </div>
            ) : (
              <div className="mfa-content">
                {/* MFA Toggle Switch */}
                <div className="mfa-toggle-container">
                  <span className="mfa-status-text">MFA Status:</span>
                  <label className="mfa-switch">
                    <input
                      type="checkbox"
                      checked={mfaEnabled}
                      onChange={() => {
                        if (mfaEnabled) {
                          handleDisableMfa();
                        } else {
                          handleEnableMfa();
                        }
                      }}
                      disabled={loading || showOtpInput}
                    />
                    <span className="mfa-slider round"></span>
                  </label>
                  <span className={`mfa-status-badge ${mfaEnabled ? 'enabled' : 'disabled'}`}>
                    {mfaEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                {/* Info text based on MFA state */}
                {!mfaEnabled && !showOtpInput && (
                  <p className="mfa-info-text">
                    When enabled, you'll need to enter an OTP sent to your email during login.
                  </p>
                )}

                {mfaEnabled && !showOtpInput && (
                  <p className="mfa-info-text warning">
                    When disabled, you'll need to verify OTP first, then login will go directly to dashboard.
                  </p>
                )}

                {/* Action in Progress Indicator */}
                {action && !showOtpInput && (
                  <div className="action-indicator">
                    {action === 'enable' ? 'Enabling MFA...' : 'Disabling MFA...'}
                  </div>
                )}

                {/* Status Indicators */}
                {otpStatus === 'sent' && !showOtpInput && (
                  <div className="status-indicator status-sent">
                    <span className="status-dot"></span>
                    OTP Sent - Check your email
                  </div>
                )}
                
                {otpStatus === 'failed' && (
                  <div className="status-indicator status-failed">
                    <span className="status-dot"></span>
                    OTP Failed - Please try again
                  </div>
                )}

                {/* OTP Input Section */}
                {showOtpInput && (
                  <div className="otp-input-section">
                    <p className="otp-instruction">
                      {action === 'enable' 
                        ? '📧 Enter the 6-digit OTP sent to your email to ENABLE MFA'
                        : '📧 Enter the 6-digit OTP sent to your email to DISABLE MFA'}
                    </p>
                    <div className="otp-input-group">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        disabled={loading}
                        className="otp-input"
                        autoFocus
                      />
                      <div className="otp-actions">
                        <button
                          onClick={verifyOtp}
                          disabled={loading || otp.length !== 6}
                          className="verify-btn"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-small"></span>
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </button>
                        <button
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="resend-btn"
                        >
                          Resend
                        </button>
                        <button
                          onClick={handleCancelOtp}
                          disabled={loading}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    
                    {/* OTP Timer hint */}
                    {otpStatus === 'sent' && (
                      <p className="otp-hint">
                        ⏱ OTP expires in 2 minutes
                      </p>
                    )}
                  </div>
                )}

                {/* Loading Overlay */}
                {loading && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button 
            className="settings-cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;