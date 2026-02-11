const router = require("express").Router();
const historyController = require("../controllers/historyController");

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
router.get("/",historyController.getAllHistory);

module.exports = router;
