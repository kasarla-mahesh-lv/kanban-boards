const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authmiddlewares");

const {
  createProject,
  getAllProjects,
  getProjectById,
  openProject,
  
} = require("../controllers/projectController");
const permissionGate = require("../middlewares/permissionGate");


router.get("/", authMiddleware,permissionGate("VIEW_PROJECTS"), getAllProjects);


router.post("/", authMiddleware,permissionGate("CREATE_PROJECT"), createProject);


router.get("/:projectId/open", authMiddleware,permissionGate("VIEW_OPENPROJECT"), openProject);


router.get("/:projectId", authMiddleware,permissionGate("VIEW_PROJECTBYID"), getProjectById);



/**
 * 
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