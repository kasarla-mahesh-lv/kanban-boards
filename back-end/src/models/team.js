// src/models/team.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true
    },
    // ✅ NEW FIELDS FOR EMAIL INVITATION
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending"
    },
    invitationToken: {
      type: String,
      default: null
    },
    invitedAt: {
      type: Date,
      default: null
    },
    acceptedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);