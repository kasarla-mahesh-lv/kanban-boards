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
} = require("../controllers/projectController");

// ✅ all projects
router.get("/", getAllProjects);

// ✅ create project
router.post("/", createProject);

// ✅ open project (must be before /:projectId)
router.get("/:projectId/open", openProject);

// ✅ tasks
router.get("/:projectId/tasks/:taskId", getTaskByTaskIdInProject);
router.get("/:projectId/tasks", getProjectTasks);
router.post("/:projectId/tasks", addTaskToProject);
router.patch("/:projectId/tasks/:taskId", updateTaskInProject);
router.delete("/:projectId/tasks/:taskId", deleteTaskInProject);

// ✅ project details
router.get("/:projectId", getProjectById);

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
