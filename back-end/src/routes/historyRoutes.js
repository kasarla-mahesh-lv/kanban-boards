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

module.exports = router;
