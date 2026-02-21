// src/controllers/teamController.js
const mongoose = require("mongoose");
const Team = require("../models/team");
const User = require("../models/User");
const ProjectModel = require("../models/project");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendInvitationEmail } = require("../services/emailService");
const { generateTemporaryPassword } = require("../utils/passwordGenerator");

// ✅ GET /api/team -> Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find().sort({ createdAt: -1 }).populate("projectId");
    return res.status(200).json(teamMembers);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ POST /api/team -> Create new team member with temporary password
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

    const emailLower = email.toLowerCase().trim();

    // ✅ CHECK 1: Email + ProjectId combination (same person, same project)
    const existingInSameProject = await Team.findOne({ 
      email: emailLower, 
      projectId 
    });
    if (existingInSameProject) {
      return res.status(400).json({ 
        message: "This user is already assigned to this project" 
      });
    }

    // ✅ CHECK 2: Email exists in ANY project (same person, any project)
    const existingInAnyProject = await Team.findOne({ 
      email: emailLower 
    });
    if (existingInAnyProject) {
      return res.status(400).json({ 
        message: "This email is already assigned to another project" 
      });
    }

    // ✅ CHECK 3: Check if user is already registered in system
    const registeredUser = await User.findOne({ email: emailLower });
    if (registeredUser) {
      return res.status(400).json({ 
        message: "This user is already registered in the system" 
      });
    }

    // ✅ GENERATE TEMPORARY PASSWORD (NO EXPIRY)
    const plainPassword = generateTemporaryPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create invitation token
    const invitationToken = jwt.sign(
      { email: emailLower, projectId, name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ STEP 1: Create in TEAM collection
    const newTeamMember = await Team.create({
      name: name.trim(),
      email: emailLower,
      projectId,
      status: "pending",
      invitationToken,
      tempPassword: hashedPassword,
      passwordChangedOnFirstLogin: false,
      invitedAt: new Date()
    });

    // ✅ STEP 2: Also create in USER collection with temp password
    const newUser = await User.create({
      name: name.trim(),
      email: emailLower,
      password: hashedPassword,
      mobilenumber: "0000000000",
      isVerified: true,
      isInvitedUser: true
    });

    // ✅ SEND EMAIL WITH CREDENTIALS
    try {
      await sendInvitationEmail(
        newTeamMember.email,
        invitationToken,
        projectId,
        plainPassword
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      await Team.findByIdAndDelete(newTeamMember._id);
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        message: "Email sending failed. Team member was not created.",
        emailError: emailError.message
      });
    }

    return res.status(201).json({
      message: "Team member created and invitation email sent",
      teamMember: newTeamMember,
      note: "User can login with email + temporary password"
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

    if (name !== undefined && name.trim() !== "") {
      teamMember.name = name.trim();
    }

    if (email !== undefined && email.trim() !== "") {
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

// ✅ POST /api/team/accept-invitation -> Accept team invitation
exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired invitation token" });
    }

    const { email, projectId } = decoded;

    const teamMember = await Team.findOneAndUpdate(
      { email, projectId, status: "pending" },
      {
        status: "active",
        invitationToken: null,
        acceptedAt: new Date()
      },
      { new: true }
    ).populate("projectId");

    if (!teamMember) {
      return res.status(404).json({ message: "Invalid invitation or already accepted" });
    }

    const authToken = jwt.sign(
      { 
        teamId: teamMember._id, 
        email: teamMember.email,
        projectId: teamMember.projectId,
        name: teamMember.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Invitation accepted successfully",
      authToken,
      redirectUrl: "/dashboard",
      teamMember
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ POST /api/team/login -> Team member login with email + password
exports.teamMemberLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Password is required" });
    }

    const emailLower = email.toLowerCase().trim();

    // 🔎 Find user
    const user = await User.findOne({ email: emailLower });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 🔐 Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🟢 IF INVITED USER
    if (user.isInvitedUser) {

      // First time login logic
      const teamMember = await Team.findOne({ email: emailLower });

      if (teamMember && !teamMember.passwordChangedOnFirstLogin) {
        return res.status(200).json({
          message: "Temporary password login successful. Please change your password.",
          requirePasswordChange: true,
          userId: user._id
        });
      }

      // After password change → normal login
    }

    // 🟢 Generate token
    const authToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      authToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};