const mongoose = require("mongoose");

const ProjectModel = require("../models/project");
const Column = require("../models/column");
const Task = require("../models/task");

/* =========================
   GET /api/projects/:projectId/tasks
========================= */
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   POST /api/projects/:projectId/tasks
   body: { title, description, columnId, priority }
========================= */
exports.addTaskToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description = "", columnId, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid columnId" });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    // column belongs to this project?
    const column = await Column.findOne({ _id: columnId, projectId });
    if (!column) {
      return res.status(404).json({ message: "Column not found for this project" });
    }

    // duplicate title in same column (optional)
    const exists = await Task.findOne({
      projectId,
      columnId,
      title: title.trim(),
    });

    if (exists) {
      return res.status(409).json({ message: "Task title already exists in this column" });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      priority,
      projectId,
      columnId,
      createdBy: req.user?._id,
    });

    // keep taskCount updated (simple recount)
    const count = await Task.countDocuments({ projectId });
    await ProjectModel.findByIdAndUpdate(projectId, { taskCount: count });

    return res.status(201).json({ message: "Task added", task });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET /api/projects/:projectId/tasks/:taskId
========================= */
exports.getTaskByTaskIdInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const taskDoc = await Task.findOne({ _id: taskId, projectId });
    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found in this project" });
    }

    return res.status(200).json({
      project: {
        _id: projectDoc._id,
        title: projectDoc.title,
        description: projectDoc.description,
      },
      task: taskDoc,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   PATCH /api/projects/:projectId/tasks/:taskId
========================= */
exports.updateTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    const taskDoc = await Task.findOne({ _id: taskId, projectId });
    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found in this project" });
    }

    const { title, description, columnId, dueDate, priority, assignee, blockers } = req.body;

    if (title !== undefined) taskDoc.title = title;
    if (description !== undefined) taskDoc.description = description;

    if (columnId !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(columnId)) {
        return res.status(400).json({ message: "Invalid columnId" });
      }
      // optional: check column belongs to same project
      const col = await Column.findOne({ _id: columnId, projectId });
      if (!col) return res.status(404).json({ message: "Column not found for this project" });

      taskDoc.columnId = columnId;
    }

    if (dueDate !== undefined) taskDoc.dueDate = dueDate;
    if (priority !== undefined) taskDoc.priority = priority;
    if (assignee !== undefined) taskDoc.assignee = assignee;
    if (blockers !== undefined) taskDoc.blockers = blockers;

    await taskDoc.save();

    return res.status(200).json({ message: "Task updated successfully", task: taskDoc });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE /api/projects/:projectId/tasks/:taskId
========================= */
exports.deleteTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Task.findOneAndDelete({ _id: taskId, projectId });
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    // recount taskCount (remove wrong $inc)
    const count = await Task.countDocuments({ projectId });
    await ProjectModel.findByIdAndUpdate(projectId, { taskCount: count });

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET /api/projects/:projectId/columns-tasks
   (columns with tasks)
========================= */
exports.getColumnsTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const columns = await Column.find({ projectId }).sort({ order: 1 });

    const columnsWithTasks = await Promise.all(
      columns.map(async (col) => {
        const tasks = await Task.find({ projectId, columnId: col._id }).sort({ createdAt: -1 });
        return { ...col.toObject(), tasks };
      })
    );

    return res.status(200).json(columnsWithTasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};