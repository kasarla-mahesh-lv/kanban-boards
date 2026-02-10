const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const authMiddleware = require("../middlewares/authmiddlewares");

/**
 * @swagger
 * /api/history/{boardId}:
 *   get:
 *     summary: Get board history
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: History fetched successfully
 */

router.get("/:boardId",authMiddleware, historyController.getBoardHistory);

module.exports = router;
