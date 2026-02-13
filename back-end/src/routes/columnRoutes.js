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

/**
 * @openapi
 * /api/projects/{projectId}/columns:
 *   get:
 *     tags: [Columns]
 *     summary: Get all columns in a project
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
router.get("/:projectId/columns", authMiddleware, getColumnsByBoard);

/**
 * @openapi
 * /api/projects/{projectId}/columns:
 *   post:
 *     tags: [Columns]
 *     summary: Create a column in a project (Add group)
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
router.post("/:projectId/columns", authMiddleware, createColumn);

/**
 * @openapi
 * /api/columns/{columnId}:
 *   patch:
 *     tags: [Columns]
 *     summary: Update a column
 *     parameters:
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "In Progress"
 *               order:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Column updated
 */
router.patch("/:columnId", authMiddleware, updateColumn);

/**
 * @openapi
 * /api/columns/{columnId}:
 *   delete:
 *     tags: [Columns]
 *     summary: Delete a column
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Column deleted
 */
router.delete("/:columnId", authMiddleware, deleteColumn);

module.exports = router;
