const router = require("express").Router();
const { createColumn, updateColumn, deleteColumn,getColumnsByBoard } = require("../controllers/columnController");
/**
 * @openapi
 * tags:
 *   - name: Columns
 *     description: Column related APIs
 */

router.get("/boards/:boardId/columns", getColumnsByBoard); // ✅ ADD THIS


router.post("/boards/:boardId/columns", createColumn);
router.patch("/boards/:boardId/columns/:columnId", updateColumn);
router.delete("/boards/:boardId/columns/:columnId", deleteColumn);

module.exports = router;

/**
 * @openapi
 * /api/columns/boards/{boardId}/columns:
 *   post:
 *     tags: [Columns]
 *     summary: Create a column in a board
 *     parameters:
 *       - in: path
 *         name: boardId
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
 *                 example: "To Do"
 *     responses:
 *       201:
 *         description: Column created
 */



 /**
 * @openapi
 * /api/columns/boards/{boardId}/columns/{columnId}:
 *   patch:
 *     tags: [Columns]
 *     summary: Update a column
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnId
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
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Column updated
 */




/**
 * @openapi
 * /api/columns/boards/{boardId}/columns:
 *   get:
 *     tags: [Columns]
 *     summary: Get all columns in a board
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Columns list
 */


router.get("/api/columns", async (req, res) => {
  try {
    const columns = await Column.find()
      .sort({ order: 1 })
      .populate({
        path: "cards",
        options: { sort: { order: 1 } }
      });

    res.status(200).json(columns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/**
 * @openapi
 * /api/columns/boards/{boardId}/columns/{columnId}:
 *   delete:
 *     tags: [Columns]
 *     summary: Delete a column
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Column deleted
 */




