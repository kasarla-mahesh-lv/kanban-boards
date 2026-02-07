const router = require("express").Router();
const { register,login } = require("../controllers/authController");
const authMiddleware=require("../middlewares/authmiddlewares");
const {getAllProjects,createProject,getProjectById,getProjectTasks,
    addTaskToProject,getTaskByTaskIdInProject,updateTaskInProject,
     deleteTaskInProject}=require("../controllers/projectController");


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Register]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - mobilenumber
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               mobilenumber:
 *                 type: number
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Login]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", login);

/**
 * @openapi
 * tags:
 *   - name: Projects
 *     description: Project & Task management APIs
 */

/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects
 *     responses:
 *       200:
 *         description: Projects list
 */
router.get("/",authMiddleware, getAllProjects);

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
router.get("/:projectId",authMiddleware, getProjectById);

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
router.get("/:projectId/tasks",authMiddleware, getProjectTasks);

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
router.post("/:projectId/tasks",authMiddleware, addTaskToProject);

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
