const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["backlog", "todo", "in progress", "done"],
      default: "todo",
    },

    dueDate: { type: Date },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    blockers: [{ type: String }],
  },
  

  { timestamps: true }
);
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    description: { type: String, default: "" },

    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String },
      },
    ],



    // ✅ ADD THIS LINE
    taskCount: { type: Number, default: 0 },

    tasks: [taskSchema]   // if still using embedded
  },
  { timestamps: true }
);

  
  
  


module.exports = mongoose.model("Projects", projectSchema);
