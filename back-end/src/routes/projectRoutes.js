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
  createTaskInProject,
  getColumnsTasks
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
router.post("/create-task", authMiddleware, createTaskInProject);
router.get("/get-columns-tasks", getColumnsTasks);

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

/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Todo Project"
 *               description:
 *                 type: string
 *                 example: "Kanban project"
 *     responses:
 *       201:
 *         description: Project created
 */
router.post("/",authMiddleware, createProject);
/**
 * @openapi
 * /api/projects/{projectId}:
 *   get:
 *     tags: [Projects]
 *     summary: Get project details by projectId
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 */

//router.get("/:projectId",authMiddleware, getProjectById);

/**
 * @openapi
 * /api/projects/{projectId}/tasks:
 *   get:
 *     tags: [Projects]
 *     summary: Get all tasks of a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task list
 */
//router.get("/:projectId/tasks",authMiddleware, getProjectTasks);

/**
 * @openapi
 * /api/projects/{projectId}/tasks:
 *   post:
 *     tags: [Projects]
 *     summary: Add task to project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Build backend"
 *               description:
 *                 type: string
 *                 example: "API work"
 *               status:
 *                 type: string
 *                 example: "todo"
 *     responses:
 *       201:
 *         description: Task added
 */
//router.post("/:projectId/tasks",authMiddleware, addTaskToProject);



/**
 * @openapi
 * /api/projects/{projectId}/tasks/{taskId}:
 *   get:
 *     tags: [Projects]
 *     summary: Get task details inside project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 */
router.get("/:projectId/tasks/:taskId",authMiddleware, getTaskByTaskIdInProject);

/**
 * @openapi
 * /api/projects/{projectId}/tasks/{taskId}:
 *   patch:
 *     tags: [Projects]
 *     summary: Update task in project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *       - in: path
 *         name: taskId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch("/:projectId/tasks/:taskId",authMiddleware, updateTaskInProject);

/**
 * @openapi
 * /api/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     tags: [Projects]
 *     summary: Delete task from project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *       - in: path
 *         name: taskId
 *         required: true
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:projectId/tasks/:taskId", authMiddleware,deleteTaskInProject);

module.exports = router;


module.exports = router;
