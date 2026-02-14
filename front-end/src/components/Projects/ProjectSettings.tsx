import React from "react";
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
          <div className="settings-section">
            <h3>General Settings</h3>
            <div className="settings-placeholder">
              <p>General project settings will be here</p>
              <div className="placeholder-shimmer"></div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Columns Configuration</h3>
            <div className="settings-placeholder">
              <p>Column management will be here</p>
              <div className="placeholder-shimmer"></div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Permissions & Access</h3>
            <div className="settings-placeholder">
              <p>Permission settings will be here</p>
              <div className="placeholder-shimmer"></div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Notifications</h3>
            <div className="settings-placeholder">
              <p>Notification preferences will be here</p>
              <div className="placeholder-shimmer"></div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Integrations</h3>
            <div className="settings-placeholder">
              <p>Integration settings will be here</p>
              <div className="placeholder-shimmer"></div>
            </div>
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