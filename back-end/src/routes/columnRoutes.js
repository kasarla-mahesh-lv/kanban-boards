const express = require("express");
const router = express.Router();

const {
  createColumn,
  updateColumn,
  deleteColumn,
  getColumnsByBoard,
} = require("../controllers/columnController");

const authMiddleware = require("../middlewares/authmiddlewares");

/**
 * @openapi
 * tags:
 *   - name: Columns
 *     description: Column related APIs
 */

<<<<<<< HEAD
router.get("/boards/:boardId/columns", getColumnsByBoard); // ✅ ADD THIS


router.post("/boards/:boardId/columns",authMiddleware, createColumn);
router.patch("/boards/:boardId/columns/:columnId",authMiddleware, updateColumn);
router.delete("/boards/:boardId/columns/:columnId",authMiddleware, deleteColumn);

module.exports = router;
=======
/**
 * @openapi
 * /api/columns/boards/{projectId}/columns:
 *   get:
 *     tags: [Columns]
 *     summary: Get all columns in a board
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Columns list
 */
router.get("/boards/:projectId/columns", authMiddleware, getColumnsByBoard);
>>>>>>> 4fe48173bafacaf163cc3caacecc6096211b4c06

/**
 * @openapi
 * /api/columns/boards/{projectId}/columns:
 *   post:
 *     tags: [Columns]
 *     summary: Create a column in a board (Add group)
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Testing"
 *     responses:
 *       201:
 *         description: Column created
 */
router.post("/boards/:projectId/columns",authMiddleware, createColumn);

/**
 * @openapi
 * /api/columns/boards/{projectId}/columns/{columnId}:
 *   patch:
 *     tags: [Columns]
 *     summary: Update a column
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Column updated
 */
router.patch("/boards/:projectId/columns/:columnId", authMiddleware, updateColumn);

/**
 * @openapi
 * /api/columns/boards/{projectId}/columns/{columnId}:
 *   delete:
 *     tags: [Columns]
 *     summary: Delete a column
 *     parameters:
 *       - in: path
 *         name: projectId
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
router.delete(
  "/boards/:projectId/columns/:columnId",
  authMiddleware,
  deleteColumn
);

module.exports = router;
