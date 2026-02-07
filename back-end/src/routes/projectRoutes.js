const express = require("express");
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectTasks,
  addTaskToProject,
  getTaskByTaskIdInProject,
  updateTaskInProject,
  deleteTaskInProject
} = require("../controllers/projectController");

// ✅ all projects
router.get("/", getAllProjects);

// ✅ create project
router.post("/", createProject);

// ✅ tasks
router.get("/:projectId/tasks/:taskId", getTaskByTaskIdInProject);
router.get("/:projectId/tasks", getProjectTasks);
router.post("/:projectId/tasks", addTaskToProject);
router.patch("/:projectId/tasks/:taskId", updateTaskInProject);
router.delete("/:projectId/tasks/:taskId", deleteTaskInProject);


// ✅ project details
router.get("/:projectId", getProjectById);

module.exports = router;
