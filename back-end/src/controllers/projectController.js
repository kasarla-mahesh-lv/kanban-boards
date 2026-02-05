const mongoose = require("mongoose");
const Project = require("../models/project");

// ✅ GET /api/projects -> all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ POST /api/projects -> create project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Project name required" });
    }

    const projects = await Project.create({
      title: title.trim(),
      description: description || "",
      tasks: [],
    });

    return res.status(201).json(project);
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
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ✅ GET /api/projects/:projectId/tasks -> all tasks of a project
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project.tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ POST /api/projects/:projectId/tasks -> add task to project
exports.addTaskToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "title is required" });
    }

    const projects = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.tasks.push({
      title: title.trim(),
      description: description || "",
      status: status || "todo",
    });

    await project.save();

    const newTask = projects.tasks[project.tasks.length - 1];

    res.status(201).json({
      message: "Task added",
      task: newTask,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET /api/projects/:projectId/tasks/:taskId -> single task in project (by Mongo _id)
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
        description: project.description
      },
      task
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ✅ Update task inside a project
exports.updateTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const projects = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found in this project" });

    // update only fields you send
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await project.save();

    res.json({ message: "Task updated", task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete task inside a project
exports.deleteTaskInProject = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const projects = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found in this project" });

    task.deleteOne(); // remove subdocument
    await project.save();

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
