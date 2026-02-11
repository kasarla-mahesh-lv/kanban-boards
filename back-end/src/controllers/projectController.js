const mongoose = require("mongoose");
const ProjectModel = require("../models/project");
const Column = require("../models/column");

// ✅ GET /api/projects -> all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ POST /api/projects -> create project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Project name required" });
    }

    await ProjectModel.create({
      title: title.trim(),
      description: description || "",
      tasks: [],
    }).then(async (projectDoc) => {
      if (!projectDoc) {
        return res.status(500).json({ message: "Failed to create project" });
      }
      
      await Column.insertMany([
        { name: "Backlog", boardId: projectDoc._id, order: 1, cards: [] },
        { name: "Todo", boardId: projectDoc._id, order: 2, cards: [] },
        { name: "In Progress", boardId: projectDoc._id, order: 3, cards: [] },
        { name: "Done", boardId: projectDoc._id, order: 4, cards: [] },
      ]);
  
      console.log(projectDoc,"project")
      return res.status(201).json(projectDoc);
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/projects/:projectId -> project full details
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/projects/:projectId/tasks -> all tasks in a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    return res.status(200).json(project.tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ POST /api/projects/:projectId/tasks -> add task to project
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

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.tasks.push({
      title: title.trim(),
      description,
      status,
      dueDate,
      priority,
      assignee,
      blockers,
    });

    await project.save();

    const newTask = project.tasks[project.tasks.length - 1];

    return res.status(201).json({
      message: "Task added",
      task: newTask,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/projects/:projectId/tasks/:taskId -> project + single task details
exports.getTaskByTaskIdInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found in this project" });
    }

    return res.status(200).json({
      project: {
        _id: project._id,
        title: project.title,
        description: project.description,
      },
      task,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ PATCH /api/projects/:projectId/tasks/:taskId -> update task
exports.updateTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, dueDate, priority, assignee, blockers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found in this project" });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee;
    if (blockers !== undefined) task.blockers = blockers;

    await project.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE /api/projects/:projectId/tasks/:taskId -> delete task
exports.deleteTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found in this project" });

    task.deleteOne();
    await project.save();

    return res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

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

    // ✅ 1) Check columns already exist or not
    const existingCount = await Column.countDocuments({ boardId: projectId });

    // ✅ 2) Create default columns ONLY ONCE (first time)
    if (existingCount === 0) {
      await Column.insertMany([
        { name: "Backlog", boardId: projectId, order: 1, cards: [] },
        { name: "Todo", boardId: projectId, order: 2, cards: [] },
        { name: "In Progress", boardId: projectId, order: 3, cards: [] },
        { name: "Done", boardId: projectId, order: 4, cards: [] },
      ]);
    }

    // ✅ 3) Fetch columns
    const columns = await Column.find({ boardId: projectId }).sort({ order: 1 });

    return res.json({ project, columns });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};