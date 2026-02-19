const router = require("express").Router();
const historyController = require("../controllers/historyController");
const authMiddleware = require("../middlewares/authmiddlewares");

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
router.get("/",authMiddleware,historyController.getAllHistory);
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
router.get("/:taskId", authMiddleware, historyController.getTaskHistory);
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

router.post("/", authMiddleware, historyController.createHistory);

module.exports = router;
