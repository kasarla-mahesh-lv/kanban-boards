import React, { useState } from "react";
import "./ProjectSettings.css";
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
const [enableMFA,setEnableMFA]=useState(false);
const [mfaCode,setMfaCode]=useState("");

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    // This will be implemented by the team working on settings
    console.log("Save settings for project:", projectId);
    onClose();
  };
 
  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Project Settings</h2>
          <button className="close-settings-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-content">
          {/* Project ID for reference */}
          <div className="project-id-info">
            <span className="info-label">Project ID:</span>
            <span className="info-value">{projectId || "N/A"}</span>
          </div>

          {/* Settings sections - to be implemented by the settings team */}
{/* MFA SECTION SEPARATE */}
<div className="settings-section">
  <h3>Security (MFA)</h3>
  <label>
    <input
      type="checkbox"
      checked={enableMFA}
      onChange={(e)=>setEnableMFA(e.target.checked)}
    />
    Enable MFA
  </label>

  {enableMFA && (
    <div style={{marginTop:"10px"}}>

      <input
        type="text"
        placeholder="Enter OTP"
        value={mfaCode}
        onChange={(e)=>setMfaCode(e.target.value)}
      />
    </div>
  )}
</div>

           
          </div>
        

        <div className="settings-footer">
          <button className="settings-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="settings-save-btn" onClick={handleSaveSettings}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;