import React, { useEffect, useState,  useMemo } from "react";
import {
  getProjectMembersApi,
  searchProjectMembersApi,
  getProjectTypesApi,
  getProjectMilestonesApi,
  getBlockersApi,
  getBlockingApi,
  getFilterPresetsApi,
  saveFilterPresetApi,
  deleteFilterPresetApi,
  type Member,
  type TaskType,
  type Milestone,
  type BlockRelation,
  type FilterPreset
} from "../Api/ApiCommon";
import "./FilterPanel.css";

interface Filters {
  search: string;
  assignedToMe: boolean;
  assignees: string[];
  dueDateOptions: string[];
  dueDateRange: { start: string | null; end: string | null };
  priority: string[];
  types: string[];
  milestones: string[];
  noBlockers: boolean;
  selectedBlockers: string[];
  noBlocking: boolean;
  selectedBlocking: string[];
  creationDate: { start: string | null; end: string | null };
  completed: boolean | null;
  createdByMe: boolean;
  selectCreators: string[];
  favorites: boolean;
  followed: boolean;
  exactMatch: boolean;
}

interface FilterPanelProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  projectId,
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) => {
  // State for dynamic data from backend
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [types, setTypes] = useState<TaskType[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [blockers, setBlockers] = useState<BlockRelation[]>([]);
  const [blocking, setBlocking] = useState<BlockRelation[]>([]);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  
  // UI state
  const [loading, setLoading] = useState({
    members: false,
    types: false,
    milestones: false,
    blockers: false,
    presets: false
  });
  
  const [filters, setFilters] = useState<Filters>(currentFilters);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [typeSearchQuery, setTypeSearchQuery] = useState("");
  const [milestoneSearchQuery, setMilestoneSearchQuery] = useState("");

  // Fetch all filter data when panel opens
  useEffect(() => {
    if (!projectId || !isOpen) return;
    
    const fetchAllData = async () => {
      try {
        // Fetch members
        setLoading(prev => ({ ...prev, members: true }));
        const membersData = await getProjectMembersApi(projectId);
        setMembers(membersData);
        setFilteredMembers(membersData);
        setLoading(prev => ({ ...prev, members: false }));
        
        // Fetch types
        setLoading(prev => ({ ...prev, types: true }));
        const typesData = await getProjectTypesApi(projectId);
        setTypes(typesData);
        setLoading(prev => ({ ...prev, types: false }));
        
        // Fetch milestones
        setLoading(prev => ({ ...prev, milestones: true }));
        const milestonesData = await getProjectMilestonesApi(projectId);
        setMilestones(milestonesData);
        setLoading(prev => ({ ...prev, milestones: false }));
        
        // Fetch blockers
        setLoading(prev => ({ ...prev, blockers: true }));
        const blockersData = await getBlockersApi(projectId);
        setBlockers(blockersData);
        const blockingData = await getBlockingApi(projectId);
        setBlocking(blockingData);
        setLoading(prev => ({ ...prev, blockers: false }));
        
        // Fetch saved presets
        setLoading(prev => ({ ...prev, presets: true }));
        const presetsData = await getFilterPresetsApi(projectId);
        setPresets(presetsData);
        setLoading(prev => ({ ...prev, presets: false }));
        
      } catch (error) {
        console.error("Failed to load filter data:", error);
      }
    };
    
    fetchAllData();
  }, [projectId, isOpen]);

  // Search members
  useEffect(() => {
    if (!memberSearchQuery.trim()) {
      setFilteredMembers(members);
      return;
    }
    
    const searchMembers = async () => {
      try {
        const results = await searchProjectMembersApi(projectId, memberSearchQuery);
        setFilteredMembers(results);
      } catch (error) {
        console.error("Failed to search members:", error);
        // Fallback to client-side filtering
        const filtered = members.filter(member => 
          member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
          member.email?.toLowerCase().includes(memberSearchQuery.toLowerCase())
        );
        setFilteredMembers(filtered);
      }
    };
    
    const debounce = setTimeout(searchMembers, 300);
    return () => clearTimeout(debounce);
  }, [memberSearchQuery, members, projectId]);

  // Filter types by search
  const filteredTypes = useMemo(() => {
    if (!typeSearchQuery.trim()) return types;
    return types.filter(type => 
      type.name.toLowerCase().includes(typeSearchQuery.toLowerCase())
    );
  }, [types, typeSearchQuery]);

  // Filter milestones by search
  const filteredMilestones = useMemo(() => {
    if (!milestoneSearchQuery.trim()) return milestones;
    return milestones.filter(ms => 
      ms.name.toLowerCase().includes(milestoneSearchQuery.toLowerCase())
    );
  }, [milestones, milestoneSearchQuery]);

  // Reset filters when currentFilters prop changes
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleCheckboxGroup = (key: keyof Filters, value: string, checked: boolean) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: checked
          ? [...arr, value]
          : arr.filter((v) => v !== value),
      };
    });
  };

  const handleDueDateRangeChange = (type: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      dueDateRange: { ...prev.dueDateRange, [type]: value }
    }));
  };

  const handleCreationDateRangeChange = (type: 'start' | 'end', value: string) => {
    setFilters(prev => ({
      ...prev,
      creationDate: { ...prev.creationDate, [type]: value }
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      assignedToMe: false,
      assignees: [],
      dueDateOptions: [],
      dueDateRange: { start: null, end: null },
      priority: [],
      types: [],
      milestones: [],
      noBlockers: false,
      selectedBlockers: [],
      noBlocking: false,
      selectedBlocking: [],
      creationDate: { start: null, end: null },
      completed: null,
      createdByMe: false,
      selectCreators: [],
      favorites: false,
      followed: false,
      exactMatch: false,
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const savePreset = async () => {
    if (!newPresetName.trim()) return;
    
    try {
      const newPreset = await saveFilterPresetApi(projectId, {
        name: newPresetName,
        filters: filters
      });
      
      setPresets([...presets, newPreset]);
      setNewPresetName("");
      setShowSaveDialog(false);
    } catch (error) {
      console.error("Failed to save filter preset:", error);
      alert("Failed to save filter. Please try again.");
    }
  };

  const deletePreset = async (presetId: string) => {
    try {
      await deleteFilterPresetApi(projectId, presetId);
      setPresets(presets.filter(p => p.id !== presetId));
    } catch (error) {
      console.error("Failed to delete filter preset:", error);
      alert("Failed to delete filter. Please try again.");
    }
  };

  const loadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters);
    setShowSaveDialog(false);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Check if filters have been modified from default
  const isFilterUnsaved = () => {
    return JSON.stringify(filters) !== JSON.stringify(currentFilters);
  };

  return (
    <>
      <div className={`filter-panel ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <h3>
            <span className="icon">🔍</span> Filter
          </h3>
          <button onClick={onClose} className="close-btn">
            <span className="icon">→</span>
          </button>
        </div>

        {/* Unsaved filter indicator */}
        {isFilterUnsaved() && (
          <div className="filter-indicator-bar">
            <span className="filter-indicator-text">
              <span className="icon">⚡</span> Unsaved filter
            </span>
            <button className="save-filter-btn" onClick={() => setShowSaveDialog(true)}>
              <span className="icon">💾</span> Custom filter
            </button>
          </div>
        )}

        <div className="filter-content">
          {/* Search */}
          <div className="filter-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Type to search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="filter-search"
            />
          </div>

          {/* ASSIGNEE */}
          <div className="filter-section">
            <h4>Assignee</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.assignedToMe}
                onChange={() => setFilters({ ...filters, assignedToMe: !filters.assignedToMe })}
              />
              <span className="icon">👤</span> Assigned to me
            </label>
            
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("members")}>
                <span className="icon">👥</span> Select members
                <span className={`chevron ${openDropdown === "members" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "members" && (
                <div className="dropdown-content">
                  <div className="dropdown-search">
                    <span className="icon">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Type to search members..." 
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="dropdown-option">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filters.assignees.includes("unassigned")}
                        onChange={(e) => handleCheckboxGroup("assignees", "unassigned", e.target.checked)}
                      /> 
                      Unassigned
                    </label>
                  </div>
                  {loading.members ? (
                    <div className="dropdown-loading">Loading members...</div>
                  ) : (
                    filteredMembers.map((member) => (
                      <div key={member.id} className="dropdown-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.assignees.includes(member.id)}
                            onChange={(e) => 
                              handleCheckboxGroup("assignees", member.id, e.target.checked)
                            }
                          />
                          <span className="member-avatar">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} />
                            ) : (
                              "👤"
                            )}
                          </span>
                          <span className="member-name">{member.name}</span>
                          {member.email && (
                            <span className="member-email">{member.email}</span>
                          )}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DUE DATE */}
          <div className="filter-section">
            <h4>Due date</h4>
            <div className="due-date-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.dueDateOptions.includes("No dates")}
                  onChange={(e) => 
                    handleCheckboxGroup("dueDateOptions", "No dates", e.target.checked)
                  }
                />
                No dates
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.dueDateOptions.includes("Overdue")}
                  onChange={(e) => 
                    handleCheckboxGroup("dueDateOptions", "Overdue", e.target.checked)
                  }
                />
                <span className="icon overdue-icon">⚠️</span> Overdue
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.dueDateOptions.includes("Due tomorrow")}
                  onChange={(e) => 
                    handleCheckboxGroup("dueDateOptions", "Due tomorrow", e.target.checked)
                  }
                />
                Due tomorrow
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.dueDateOptions.includes("Due the next week")}
                  onChange={(e) => 
                    handleCheckboxGroup("dueDateOptions", "Due the next week", e.target.checked)
                  }
                />
                Due the next week
              </label>
            </div>

            {/* Custom date range picker */}
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("customDate")}>
                <span className="icon">📅</span> Custom date
                <span className={`chevron ${openDropdown === "customDate" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "customDate" && (
                <div className="dropdown-content date-range-picker">
                  <div className="date-range-row">
                    <span>Start → End</span>
                  </div>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      value={filters.dueDateRange.start || ''}
                      onChange={(e) => handleDueDateRangeChange('start', e.target.value)}
                      className="date-input"
                    />
                    <span className="date-separator">→</span>
                    <input
                      type="date"
                      value={filters.dueDateRange.end || ''}
                      onChange={(e) => handleDueDateRangeChange('end', e.target.value)}
                      className="date-input"
                    />
                  </div>
                  
                  {/* Mini calendar - February 2026 */}
                  <div className="mini-calendar">
                    <div className="calendar-header">
                      <button className="calendar-nav">◀</button>
                      <span>February 2026</span>
                      <button className="calendar-nav">▶</button>
                    </div>
                    <div className="calendar-weekdays">
                      {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
                        <div key={d} className="weekday">{d}</div>
                      ))}
                    </div>
                    <div className="calendar-days">
                      {[26,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,1].map((day, i) => (
                        <div 
                          key={i} 
                          className={`calendar-day ${
                            (i < 7 && day > 20) || (i > 30) ? 'other-month' : ''
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="not-selected">
                    <span className="icon">⏺️</span> Not selected
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TYPES */}
          <div className="filter-section">
            <h4>Types</h4>
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("types")}>
                <span className="icon">🏷️</span> Select types
                <span className={`chevron ${openDropdown === "types" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "types" && (
                <div className="dropdown-content">
                  <div className="dropdown-search">
                    <span className="icon">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Type to search types..." 
                      value={typeSearchQuery}
                      onChange={(e) => setTypeSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="dropdown-option">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filters.types.includes("no-type")}
                        onChange={(e) => handleCheckboxGroup("types", "no-type", e.target.checked)}
                      /> 
                      No type
                    </label>
                  </div>
                  {loading.types ? (
                    <div className="dropdown-loading">Loading types...</div>
                  ) : (
                    filteredTypes.map((type) => (
                      <div key={type.id} className="dropdown-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.types.includes(type.id)}
                            onChange={(e) => 
                              handleCheckboxGroup("types", type.id, e.target.checked)
                            }
                          />
                          {type.color && (
                            <span 
                              className="type-color-dot" 
                              style={{ backgroundColor: type.color }}
                            />
                          )}
                          {type.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MILESTONES */}
          <div className="filter-section">
            <h4>Milestones</h4>
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("milestones")}>
                <span className="icon">🎯</span> Select milestones
                <span className={`chevron ${openDropdown === "milestones" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "milestones" && (
                <div className="dropdown-content">
                  <div className="dropdown-search">
                    <span className="icon">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Type to search milestones..." 
                      value={milestoneSearchQuery}
                      onChange={(e) => setMilestoneSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="dropdown-option">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filters.milestones.includes("no-milestone")}
                        onChange={(e) => handleCheckboxGroup("milestones", "no-milestone", e.target.checked)}
                      /> 
                      No milestone
                    </label>
                  </div>
                  {loading.milestones ? (
                    <div className="dropdown-loading">Loading milestones...</div>
                  ) : (
                    filteredMilestones.map((ms) => (
                      <div key={ms.id} className="dropdown-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.milestones.includes(ms.id)}
                            onChange={(e) => 
                              handleCheckboxGroup("milestones", ms.id, e.target.checked)
                            }
                          />
                          {ms.name}
                          {ms.dueDate && (
                            <span className="milestone-due">({new Date(ms.dueDate).toLocaleDateString()})</span>
                          )}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* PRIORITY */}
          <div className="filter-section">
            <h4>Priority</h4>
            <div className="priority-group">
              <label className="priority-option">
                <input
                  type="radio"
                  name="priority"
                  checked={filters.priority.includes("Default")}
                  onChange={() => {
                    setFilters(prev => ({ ...prev, priority: ["Default"] }));
                  }}
                />
                <span className="priority-dot default">○</span> Default
              </label>
              <label className="priority-option low">
                <input
                  type="radio"
                  name="priority"
                  checked={filters.priority.includes("Low")}
                  onChange={() => setFilters(prev => ({ ...prev, priority: ["Low"] }))}
                />
                <span className="priority-icon low">▲</span> Low priority
              </label>
              <label className="priority-option medium">
                <input
                  type="radio"
                  name="priority"
                  checked={filters.priority.includes("Medium")}
                  onChange={() => setFilters(prev => ({ ...prev, priority: ["Medium"] }))}
                />
                <span className="priority-icon medium">▲</span> Medium priority
              </label>
              <label className="priority-option high">
                <input
                  type="radio"
                  name="priority"
                  checked={filters.priority.includes("High")}
                  onChange={() => setFilters(prev => ({ ...prev, priority: ["High"] }))}
                />
                <span className="priority-icon high">▲</span> High priority
              </label>
            </div>
          </div>

          {/* RELATIONS */}
          <div className="filter-section">
            <h4>Relations</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.noBlockers}
                onChange={(e) => setFilters({ ...filters, noBlockers: e.target.checked })}
              />
              <span className="icon">🚫</span> No blockers
            </label>
            
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("blockers")}>
                <span className="icon">🔗</span> Select blockers
                <span className={`chevron ${openDropdown === "blockers" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "blockers" && (
                <div className="dropdown-content">
                  {loading.blockers ? (
                    <div className="dropdown-loading">Loading blockers...</div>
                  ) : (
                    blockers.map((blocker) => (
                      <div key={blocker.id} className="dropdown-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.selectedBlockers.includes(blocker.id)}
                            onChange={(e) => 
                              handleCheckboxGroup("selectedBlockers", blocker.id, e.target.checked)
                            }
                          />
                          <span className={`task-type-indicator ${blocker.type?.toLowerCase()}`} />
                          {blocker.title}
                          <span className="blocker-status">{blocker.status}</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.noBlocking}
                onChange={(e) => setFilters({ ...filters, noBlocking: e.target.checked })}
              />
              <span className="icon">🚫</span> No blocking
            </label>
            
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("blocking")}>
                <span className="icon">🔗</span> Select blocking
                <span className={`chevron ${openDropdown === "blocking" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "blocking" && (
                <div className="dropdown-content">
                  {loading.blockers ? (
                    <div className="dropdown-loading">Loading blocking tasks...</div>
                  ) : (
                    blocking.map((block) => (
                      <div key={block.id} className="dropdown-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.selectedBlocking.includes(block.id)}
                            onChange={(e) => 
                              handleCheckboxGroup("selectedBlocking", block.id, e.target.checked)
                            }
                          />
                          <span className={`task-type-indicator ${block.type?.toLowerCase()}`} />
                          {block.title}
                          <span className="blocker-status">{block.status}</span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CREATION DATE */}
          <div className="filter-section">
            <h4>Creation date</h4>
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("creationDate")}>
                <span className="icon">📅</span> Custom date
                <span className={`chevron ${openDropdown === "creationDate" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "creationDate" && (
                <div className="dropdown-content date-range-picker">
                  <div className="date-range-row">
                    <span>Start → End</span>
                  </div>
                  <div className="date-range-inputs">
                    <input
                      type="date"
                      value={filters.creationDate.start || ''}
                      onChange={(e) => handleCreationDateRangeChange('start', e.target.value)}
                      className="date-input"
                    />
                    <span className="date-separator">→</span>
                    <input
                      type="date"
                      value={filters.creationDate.end || ''}
                      onChange={(e) => handleCreationDateRangeChange('end', e.target.value)}
                      className="date-input"
                    />
                  </div>
                  <div className="not-selected">
                    <span className="icon">⏺️</span> Not selected
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MISC */}
          <div className="filter-section">
            <h4>Misc</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.completed === true}
                onChange={() => 
                  setFilters({ 
                    ...filters, 
                    completed: filters.completed === true ? null : true 
                  })
                }
              />
              <span className="icon">✅</span> Marked as complete
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.completed === false}
                onChange={() => 
                  setFilters({ 
                    ...filters, 
                    completed: filters.completed === false ? null : false 
                  })
                }
              />
              <span className="icon">⭕</span> Not marked as complete
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.createdByMe}
                onChange={() => setFilters({ ...filters, createdByMe: !filters.createdByMe })}
              />
              <span className="icon">✍️</span> Created by me
            </label>
            
            <div className="dropdown-group">
              <div className="dropdown-header" onClick={() => toggleDropdown("creators")}>
                <span className="icon">👥</span> Select creators
                <span className={`chevron ${openDropdown === "creators" ? "open" : ""}`}>▼</span>
              </div>
              
              {openDropdown === "creators" && (
                <div className="dropdown-content">
                  {loading.members ? (
                    <div className="dropdown-loading">Loading creators...</div>
                  ) : (
                    members.map((member) => (
                      <div key={member.id} className="dropdown-option">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={filters.selectCreators.includes(member.id)}
                            onChange={(e) => 
                              handleCheckboxGroup("selectCreators", member.id, e.target.checked)
                            }
                          />
                          <span className="member-avatar">👤</span> {member.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.favorites}
                onChange={() => setFilters({ ...filters, favorites: !filters.favorites })}
              />
              <span className="icon">⭐</span> Favorites
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.followed}
                onChange={() => setFilters({ ...filters, followed: !filters.followed })}
              />
              <span className="icon">👁️</span> Followed
            </label>
          </div>

          {/* EXACT MATCH - Bottom */}
          <div className="filter-section exact-match-section">
            <label className="checkbox-label exact-match">
              <input
                type="checkbox"
                checked={filters.exactMatch}
                onChange={() => setFilters({ ...filters, exactMatch: !filters.exactMatch })}
              />
              <span className="icon">🎯</span> Exact match
            </label>
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              <span className="icon">🗑️</span> Clear
            </button>
            <button className="apply-filters-btn" onClick={handleApply}>
              <span className="icon">✓</span> Apply
            </button>
          </div>
        </div>
      </div>

      {/* SAVE FILTER DIALOG */}
      {showSaveDialog && (
        <div className="modal-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3 className="modal-title">Save filter</h3>
              <p className="modal-sub">Custom filter</p>
            </div>
            
            <div className="form-group">
              <label className="label">Filter name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., My priority tasks"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="filter-presets-list">
              <h4>Saved filters</h4>
              {loading.presets ? (
                <div className="dropdown-loading">Loading saved filters...</div>
              ) : presets.length === 0 ? (
                <div className="no-presets">No saved filters yet</div>
              ) : (
                presets.map((preset) => (
                  <div key={preset.id} className="preset-item">
                    <span className="preset-name">{preset.name}</span>
                    <div className="preset-actions">
                      <button className="load-preset-btn" onClick={() => loadPreset(preset)}>
                        Load
                      </button>
                      <button 
                        className="delete-preset-btn" 
                        onClick={() => deletePreset(preset.id)}
                        title="Delete preset"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={savePreset} 
                disabled={!newPresetName.trim()}
              >
                <span className="icon">💾</span> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;