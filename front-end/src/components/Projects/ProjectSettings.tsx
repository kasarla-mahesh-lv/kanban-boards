import React, { useState, useEffect } from "react";
import { sendMfaOtpApi, verifyMfaOtpApi, disableMfaApi } from "../Api/ApiCommon";
import "./ProjectSettings.css";


//checkMfaStatusApi
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

  // Check MFA status when component opens
  useEffect(() => {
    if (isOpen) {
      checkMfaStatus();
    }
  }, [isOpen]);

  const checkMfaStatus = async () => {
    try {
      setInitialLoading(true);
      //const response = await checkMfaStatusApi();
      //setMfaEnabled(response.mfaEnabled);
    } catch (err: any) {
      console.log("Failed to check MFA status:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleMfaToggle = async () => {
    if (mfaEnabled) {
      // Disable MFA
      try {
        setLoading(true);
        await disableMfaApi();
        setMfaEnabled(false);
        alert("MFA Disabled Successfully");
      } catch (err: any) {
        console.log("Disable MFA ERROR:", err?.response?.data || err.message);
        alert("Failed to disable MFA");
      } finally {
        setLoading(false);
      }
    } else {
      // Enable MFA - send OTP
      try {
        setLoading(true);
        await sendMfaOtpApi();
        alert("OTP sent to your email");
        setShowOtpInput(true);
      } catch (err: any) {
        console.log("OTP ERROR:", err?.response?.data || err.message);
        alert("Failed to send OTP");
      } finally {
        setLoading(false);
      }
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      await verifyMfaOtpApi(otp);
      setMfaEnabled(true);
      setShowOtpInput(false);
      setOtp("");
      alert("MFA Enabled Successfully");
    } catch (err: any) {
      console.log("VERIFY ERROR:", err?.response?.data || err.message);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpInput(false);
    setOtp("");
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="settings-header">
          <h2>Project Settings</h2>
          <button className="close-settings-btn" onClick={onClose}>
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

          {/* MFA SECTION */}
          <div className="settings-section">
            <h3>MFA Security</h3>

            {initialLoading ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                Loading MFA status...
              </div>
            ) : (
              <div style={{ padding: "10px 0" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={mfaEnabled}
                    onChange={handleMfaToggle}
                    disabled={loading || showOtpInput}
                  />
                  Enable Multi-Factor Authentication
                </label>

                {showOtpInput && (
                  <div style={{ 
                    marginTop: "15px", 
                    padding: "15px", 
                    backgroundColor: "#f5f5f5", 
                    borderRadius: "8px" 
                  }}>
                    <p style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
                      Enter the 6-digit OTP sent to your email
                    </p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        style={{
                          padding: "8px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          flex: "1",
                          minWidth: "150px",
                        }}
                      />
                      <button
                        onClick={verifyOtp}
                        disabled={loading || !otp}
                        className="settings-save-btn"
                        style={{ padding: "8px 16px" }}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        onClick={handleCancelOtp}
                        className="settings-cancel-btn"
                        style={{ padding: "8px 16px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {mfaEnabled && !showOtpInput && (
                  <p style={{ color: "#4caf50", marginTop: "10px", fontSize: "14px" }}>
                    ✓ MFA is enabled for your account
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;