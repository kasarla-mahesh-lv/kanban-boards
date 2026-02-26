const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authmiddlewares");

const {
  getProjectTasks,
  addTaskToProject,
  getTaskByTaskIdInProject,
  updateTaskInProject,
  deleteTaskInProject,
  getColumnsTasks
} = require("../controllers/taskController");
const permissionGate = require("../middlewares/permissionGate");

router.get("/projects/:projectId/tasks", authMiddleware,permissionGate("VIEW_PROJECTTASKS"),getProjectTasks);


router.post("/projects/:projectId/tasks", authMiddleware,permissionGate("CREATE_TASKTOPROJECT") ,addTaskToProject);


router.get("/projects/:projectId/tasks/:taskId", authMiddleware,permissionGate("VIEW_TASKBYTASKIDINPROJECT"),getTaskByTaskIdInProject);


router.patch("/projects/:projectId/tasks/:taskId", authMiddleware,permissionGate("UPDATE_TASKINPROJECT"),updateTaskInProject);


router.delete("/projects/:projectId/tasks/:taskId", authMiddleware,permissionGate("DELETE_TASKINPROJECT"),deleteTaskInProject);


router.get("/projects/:projectId/columns-tasks", authMiddleware,permissionGate("VIEW_COLUMNSTASKS"),getColumnsTasks);

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
//router.get("/:projectId/tasks",authMiddlewares, getProjectTasks);

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
 *               columnId:
 *                 type: string
 *                 example: "TODO_COLUMN_ID"
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
//router.get("/:projectId/tasks/:taskId",authMiddleware, getTaskByTaskIdInProject);

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
//router.patch("/:projectId/tasks/:taskId",authMiddleware, updateTaskInProject);

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
//router.delete("/:projectId/tasks/:taskId", authMiddleware,deleteTaskInProject);

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Returns list of all projects
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "6979cea052cdbca326ae2b16"
 *                   title:
 *                     type: string
 *                     example: "Kanban Board"
 *                   description:
 *                     type: string
 *                     example: "Project management board"
 *                   createdAt:
 *                     type: string
 *                     example: "2026-02-13T06:28:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     example: "2026-02-13T06:28:00.000Z"
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */


module.exports = router;