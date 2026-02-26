import React, { useEffect, useState } from "react";
import "./Roles.css";
import { getAllRolesApi, type Role } from "./Api/RolesApi";

export type RoleUser = {
  empId: string;
  name: string;
  position: string;
};

type Props = {
  title?: string;
  data?: RoleUser[];
  loading?: boolean;
  onRoleOpen?: () => void;
  onAddRole?: () => void;
};

const Roles: React.FC<Props> = ({
  title = "Employee Roles",
  data: propData,
  loading: propLoading = false,
  onRoleOpen,
  onAddRole,
}) => {
  const [roles, setRoles] = useState<RoleUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewRow, setShowNewRow] = useState<boolean>(false);
  const [newRole, setNewRole] = useState<RoleUser>({
    empId: "",
    name: "",
    position: ""
  });

  
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching roles from API...");
      const rolesData = await getAllRolesApi();
      console.log("API Response - rolesData:", rolesData);
      
      
      const transformedRoles: RoleUser[] = rolesData
        .map((role: Role, index: number) => {
          console.log("Processing role:", role);
          
          return {
            empId: role._id ? role._id.substring(0, 8).toUpperCase() : `EMP${String(index + 1).padStart(3, '0')}`,
            name: role.name ? role.name.charAt(0).toUpperCase() + role.name.slice(1) : "Unknown User",
            position: role.name ? role.name.charAt(0).toUpperCase() + role.name.slice(1) : "Employee"
          };
        })
        
        .filter(role => 
          
          role.position === "Admin" || 
          role.position === "Manager" || 
          role.position === "Teamlead"||
          role.position === "Employee"
        );
      
      console.log("Transformed roles for display:", transformedRoles);
      setRoles(transformedRoles);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  
  const handleRole = () => {
    console.log("handleRole: Roles page opened");
    onRoleOpen?.();
    fetchRoles();
  };

  
  const handleAddRole = () => {
    console.log("Add role button clicked");
    
    
    const emptyRole: RoleUser = {
      empId: "", 
      name: "",
      position: ""
    };
    
    setNewRole(emptyRole);
    setShowNewRow(true);
    
    
    onAddRole?.();
  };

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RoleUser) => {
    setNewRole({
      ...newRole,
      [field]: e.target.value
    });
  };

  
  const handleSaveNewRole = () => {
    if (newRole.empId && newRole.name && newRole.position) {
      
      setRoles([...roles, newRole]);
      setShowNewRow(false);
      
      
      setNewRole({
        empId: "",
        name: "",
        position: ""
      });
    } else {
      alert("Please fill in Emp ID, Name, and Position");
    }
  };

  
  const handleCancelNewRole = () => {
    setShowNewRow(false);
    setNewRole({
      empId: "",
      name: "",
      position: ""
    });
  };


  useEffect(() => {
    handleRole();
  }, []);

  
  const displayData = propData && propData.length > 0 ? propData : roles;
  const isLoading = propLoading || loading;

  return (
    <div className="rolesCard">
      <div className="rolesCardHeader">
        <h2 className="rolesCardTitle">{title}</h2>
        <button 
          className="addRoleButton"
          onClick={handleAddRole}
        >
          <span className="addRoleIcon">+</span> Add Role
        </button>
      </div>

      {error && (
        <div className="errorMessage">
          Error: {error}
        </div>
      )}

      <div className="rolesTableWrap">
        <table className="rolesTable">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Position</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="rolesEmpty">
                  <div className="loadingMessage">
                    Loading roles...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="rolesEmpty">
                  <div className="errorMessage">
                    Error: {error}
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 && !showNewRow ? (
              <tr>
                <td colSpan={3} className="rolesEmpty">
                  <div className="emptyMessage">
                    No roles found. Click "Add Role" to create one.
                  </div>
                </td>
              </tr>
            ) : (
              <>
            
                {displayData.map((user) => (
                  <tr key={user.empId}>
                    <td className="empIdCell">
                      <span className="empIdText">
                        {user.empId}
                      </span>
                    </td>
                    <td className="nameCell">{user.name}</td>
                    <td>
                      <span className="positionBadge">
                        {user.position}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {showNewRow && (
                  <tr className="newRow">
                    <td>
                      <input
                        type="text"
                        placeholder="Enter Emp ID"
                        value={newRole.empId}
                        onChange={(e) => handleInputChange(e, 'empId')}
                        className="newRoleInput"
                        autoFocus
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter name"
                        value={newRole.name}
                        onChange={(e) => handleInputChange(e, 'name')}
                        className="newRoleInput"
                      />
                    </td>
                    <td>
                      <div className="newRoleActions">
                        <input
                          type="text"
                          placeholder="Enter position"
                          value={newRole.position}
                          onChange={(e) => handleInputChange(e, 'position')}
                          className="newRoleInput"
                        />
                        <button 
                          onClick={handleSaveNewRole}
                          className="actionButton saveButton"
                          title="Save"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={handleCancelNewRole}
                          className="actionButton cancelButton"
                          title="Cancel"
                        >
                          ✗
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        
        {!isLoading && !error && roles.length > 0 && (
          <div className="totalRoles">
            Total roles: {roles.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roles;