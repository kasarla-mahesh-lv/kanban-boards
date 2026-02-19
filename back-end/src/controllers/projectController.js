// src/controllers/projectController.js
const mongoose = require("mongoose");
const ProjectModel = require("../models/project");
const Column = require("../models/column");
const Task = require("../models/task");

/* =========================
   GET /api/projects
========================= */
exports.getAllProjects = async (req, res) => {
  try {
    const projectList = await ProjectModel.find().sort({ createdAt: -1 });
    return res.status(200).json(projectList);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   POST /api/projects  (CREATE PROJECT)
   + create default columns ONLY ONCE (no duplicates)
========================= */
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Project title is required" });
    }

    const projectDoc = await ProjectModel.create({
      title: title.trim(),
      description: description || "",
      tasks: [],
      members: [{ userId: req.user.id, role: "Admin" }],
    });

    // ✅ default columns (always lowercase) + no duplicates
    const defaults = [
      { name: "backlog", order: 1 },
      { name: "todo", order: 2 },
      { name: "in progress", order: 3 },
      { name: "done", order: 4 },
    ];

    for (const col of defaults) {
      await Column.updateOne(
        { projectId: projectDoc._id, name: col.name },
        {
          $setOnInsert: {
            projectId: projectDoc._id,
            name: col.name,
            order: col.order,
            cards: [],
          },
        },
        { upsert: true }
      );
    }

    return res.status(201).json(projectDoc);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


/* =========================
   GET /api/projects/:projectId
========================= */
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(projectDoc);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET /api/projects/:projectId/tasks
========================= */
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(projectDoc.tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   POST /api/projects/:projectId/tasks  (add embedded task)
========================= */
exports.addTaskToProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const {
      title,
      description = "",
      status = "todo",
      dueDate,
      priority,
      assignee,
      blockers,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) {
      return res.status(404).json({ message: "Project not found" });
    }

    projectDoc.tasks.push({
      title: title.trim(),
      description,
      status,
      dueDate,
      priority,
      assignee,
      blockers,
    });

    await projectDoc.save();

    const newTaskDoc = projectDoc.tasks[projectDoc.tasks.length - 1];

    return res.status(201).json({ message: "Task added", task: newTaskDoc });
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

    const taskDoc = projectDoc.tasks.id(taskId);
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

    const taskDoc = projectDoc.tasks.id(taskId);
    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found in this project" });
    }

    const { title, description, status, dueDate, priority, assignee, blockers } =
      req.body;

    if (title !== undefined) taskDoc.title = title;
    if (description !== undefined) taskDoc.description = description;
    if (status !== undefined) taskDoc.status = status;
    if (dueDate !== undefined) taskDoc.dueDate = dueDate;
    if (priority !== undefined) taskDoc.priority = priority;
    if (assignee !== undefined) taskDoc.assignee = assignee;
    if (blockers !== undefined) taskDoc.blockers = blockers;

    await projectDoc.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task: taskDoc,
    });
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

    const taskDoc = projectDoc.tasks.id(taskId);
    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found in this project" });
    }

    taskDoc.deleteOne();
    await projectDoc.save();

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET /api/projects/:projectId/open
   + ensure defaults exist (NO duplicates)
========================= */
exports.openProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const defaults = [
      { name: "Backlog", order: 1 },
      { name: "Todo", order: 2 },
      { name: "In Progress", order: 3 },
      { name: "Done", order: 4 },
    ];

    for (const col of defaults) {
      await Column.updateOne(
  { projectId: projectId, name: col.name }, // ✅ use name only
  { $setOnInsert: { projectId: projectId, name: col.name, order: col.order, cards: [] } },
  { upsert: true }
);

    }

    const columns = await Column.find({ projectId: projectId }).sort({ order: 1 });

    return res.status(200).json({ project, columns });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   POST create task (Task collection)
========================= */
exports.createTaskInProject = async (req, res) => {
  try {
    const { projectId, columnId, title, description, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid columnId" });
    }
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "title is required" });
    }

    const projectDoc = await ProjectModel.findById(projectId);
    if (!projectDoc) return res.status(404).json({ message: "Project not found" });

    const columnDoc = await Column.findById(columnId);
    if (!columnDoc) return res.status(404).json({ message: "Column not found" });

    const newTask = await Task.create({
      title: String(title).trim(),
      description: description || "",
      priority,
      projectId,
      columnId,
      createdBy: req.user?._id,
    });

    return res.status(201).json({ message: "Task created", task: newTask });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET /api/projects/get-columns-tasks?projectId=
========================= */
exports.getColumnsTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const columns = await Column.find({ projectId: projectId }).sort({ order: 1 });

    const columnsWithTasks = await Promise.all(
      columns.map(async (col) => {
        const tasks = await Task.find({ columnId: col._id });
        return { ...col.toObject(), tasks };
      })
    );

    return res.status(200).json(columnsWithTasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

