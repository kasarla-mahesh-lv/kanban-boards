const router = require("express").Router();
const historyController = require("../controllers/historyController");
const authMiddleware = require("../middlewares/authmiddlewares");
const permissionGate = require("../middlewares/permissionGate");

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get full history
 *     tags: [History]
 *     responses:
 *       200:
 *         description: Full history fetched successfully
 */
router.get("/",authMiddleware,permissionGate("VIEW_HISTORY"),historyController.getAllHistory);
/**
 * @swagger
 * /api/history/{taskId}:
 *   get:
 *     summary: Get history for a specific task
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task history fetched successfully
 */
router.get("/:taskId", authMiddleware,permissionGate("VIEW_TASKHISTORY"), historyController.getTaskHistory);
/**
 * @swagger
 * /api/history:
 *   post:
 *     summary: Create new history record
 *     tags: [History]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - activity
 *             properties:
 *               taskId:
 *                 type: string
 *               activity:
 *                 type: string
 *               createdBy:
 *                type: string
 *     responses:
 *       201:
 *         description: History created successfully
 */

router.post("/", authMiddleware,permissionGate("CREATE_HISTORY"), historyController.createHistory);

module.exports = router;
