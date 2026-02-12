const express = require("express");
const router = express.Router();

// ✅ controllers ni okate place lo import cheyyi (top lo)
const {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectTasks,
  addTaskToProject,
  getTaskByTaskIdInProject,
  updateTaskInProject,
  deleteTaskInProject,
  openProject,
  createTaskInProject
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authmiddlewares");

// ✅ all projects
router.get("/",authMiddleware, getAllProjects);

// ✅ create project
router.post("/", authMiddleware,createProject);

// ✅ open project (must be before /:projectId)
router.get("/:projectId/open",authMiddleware, openProject);

// ✅ tasks
router.get("/:projectId/tasks/:taskId",authMiddleware, getTaskByTaskIdInProject);
router.get("/:projectId/tasks",authMiddleware, getProjectTasks);
router.post("/:projectId/tasks",authMiddleware, addTaskToProject);
router.patch("/:projectId/tasks/:taskId",authMiddleware, updateTaskInProject);
router.delete("/:projectId/tasks/:taskId",authMiddleware, deleteTaskInProject);
router.post("/create-task", createTaskInProject);

// ✅ project details
router.get("/:projectId",authMiddleware, getProjectById);

/**
 * @openapi
 * /api/projects/{projectId}/open:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Open project and auto-create default columns
 *     description: Returns project details along with Backlog, Todo, In Progress, Done columns
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project with default columns
 *       400:
 *         description: Invalid projectId
 *       404:
 *         description: Project not found
 */


module.exports = router;
