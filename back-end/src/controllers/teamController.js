// src/controllers/teamController.js
const mongoose = require("mongoose");
const Team = require("../models/team");
const ProjectModel = require("../models/project");

// ✅ GET /api/team -> Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find().sort({ createdAt: -1 }).populate("projectId");
    return res.status(200).json(teamMembers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ POST /api/team -> Create new team member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, email, projectId } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    // Check if project exists
    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if email already exists
    const existingTeamMember = await Team.findOne({ email: email.toLowerCase() });
    if (existingTeamMember) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newTeamMember = await Team.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      projectId
    });

    return res.status(201).json({
      message: "Team member created successfully",
      teamMember: newTeamMember
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/team/:teamId -> Get single team member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const teamMember = await Team.findById(teamId).populate("projectId");
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    return res.status(200).json(teamMember);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/team/project/:projectId -> Get all team members of a project
exports.getTeamMembersByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const teamMembers = await Team.find({ projectId }).sort({ createdAt: -1 });

    return res.status(200).json(teamMembers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ PATCH /api/team/:teamId -> Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, email, projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const teamMember = await Team.findById(teamId);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Update only fields that are provided
    if (name !== undefined && name.trim() !== "") {
      teamMember.name = name.trim();
    }

    if (email !== undefined && email.trim() !== "") {
      // Check if email already exists (and it's not the same member)
      const existingEmail = await Team.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: teamId } 
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      teamMember.email = email.toLowerCase().trim();
    }

    if (projectId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Invalid projectId" });
      }
      const projectDoc = await ProjectModel.findById(projectId);
      if (!projectDoc) {
        return res.status(404).json({ message: "Project not found" });
      }
      teamMember.projectId = projectId;
    }

    await teamMember.save();

    return res.status(200).json({
      message: "Team member updated successfully",
      teamMember
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE /api/team/:teamId -> Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    const teamMember = await Team.findByIdAndDelete(teamId);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    return res.status(200).json({ message: "Team member deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};