const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // 🔹 Relationships
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // 🔥 Instead of enum → reference Column
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },

    // 🔹 Assignment
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔹 Optional Fields
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    type: {
      type: String,
      enum: ["Task", "Bug", "Feature", "Improvement"],
      default: "Task",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    milestone: {
      type: String,
      default: "",
    },

    blockers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    blocking: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    subtasks: [subtaskSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Task || mongoose.model("Task", taskSchema);
 