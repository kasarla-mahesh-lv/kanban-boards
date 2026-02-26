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
    const projects = await ProjectModel.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      projects.map(async (p) => {
        const taskCount = await Task.countDocuments({ projectId: p._id });
        return { ...p.toObject(), taskCount };
      })
    );

    return res.status(200).json(result);
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
    if (!project) return res.status(404).json({ message: "Project not found" });

    const defaults = [
      { name: "backlog", order: 1 },
      { name: "todo", order: 2 },
      { name: "in progress", order: 3 },
      { name: "done", order: 4 },
    ];

    for (const col of defaults) {
      const colName = col.name.trim().toLowerCase();
      await Column.updateOne(
        { projectId, name: colName },
        { $setOnInsert: { projectId, name: colName, order: col.order, cards: [] } },
        { upsert: true }
      );
    }

    const columns = await Column.find({ projectId }).sort({ order: 1 });

    return res.status(200).json({ project, columns });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
   