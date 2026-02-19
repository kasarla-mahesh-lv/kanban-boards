const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },

    // Todo / In Progress / Done
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
    },

    // Due date
    dueDate: {
      type: Date
    },
  

    // Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    // Assigned user (future ready)
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // Blocking / Blocked by
    blockers: [
      {
        type: mongoose.Schema.Types.ObjectId // taskId
      }
    ]
  },
  { timestamps: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: String,
    members: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["Admin", "Manager", "TL", "Employee"], default: "Employee" }
  }
],


    tasks: [taskSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projects", projectSchema);
