const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authmiddlewares");
const {
  createColumn,
  updateColumn,
  deleteColumn,
  getColumnsByProject,
} = require("../controllers/columnController");

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
router.get("/projects/:projectId", authMiddleware, getColumnsByProject);

/**
 * @openapi
 * /api/projects/{projectId}/columns:
 *   post:
 *     tags: [Columns]
 *     summary: Create a column in a project (Add Group)
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
 *       409:
 *         description: Duplicate column name
 */
router.post("/projects/:projectId", authMiddleware, createColumn);

/**
 * @openapi
 * /api/columns/{columnId}:
 *   patch:
 *     tags: [Columns]
 *     summary: Update a column (name/order)
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
 *               order:
 *                 type: number
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