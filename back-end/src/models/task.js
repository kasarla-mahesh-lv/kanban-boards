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
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects", // ✅ your project model name
      required: true,
      index: true,
    },

    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },

    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

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

    dueDate: { type: Date, default: null },
    milestone: { type: String, default: "" },

    blockers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    blocking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

    subtasks: [subtaskSchema],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);