const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectTasks,
  addTaskToProject,
  getTaskByTaskIdInProject
} = require("../controllers/projectController");

// ✅ all projects
router.get("/", getAllProjects);

// ✅ create project
router.post("/", createProject);

// ✅ tasks
router.get("/:projectId/tasks/:taskId", getTaskByTaskIdInProject);
router.get("/:projectId/tasks", getProjectTasks);
router.post("/:projectId/tasks", addTaskToProject);

// ✅ project details
router.get("/:projectId", getProjectById);

module.exports = router;
