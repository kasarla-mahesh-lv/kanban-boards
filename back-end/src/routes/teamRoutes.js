const express = require("express");
const router = express.Router();

// ✅ controllers ni okate place lo import cheyyi (top lo)
const {
  getAllTeamMembers,
  createTeamMember,
  getTeamMemberById,
  getTeamMembersByProjectId,
  updateTeamMember,
  deleteTeamMember
} = require("../controllers/teamController");
const authMiddleware = require("../middlewares/authmiddlewares");

// ✅ all team members
router.get("/", authMiddleware, getAllTeamMembers);

// ✅ create team member
router.post("/", authMiddleware, createTeamMember);

// ✅ get team members by project
router.get("/project/:projectId", authMiddleware, getTeamMembersByProjectId);

// ✅ get single team member
router.get("/:teamId", authMiddleware, getTeamMemberById);

// ✅ update team member
router.patch("/:teamId", authMiddleware, updateTeamMember);

// ✅ delete team member
router.delete("/:teamId", authMiddleware, deleteTeamMember);

/**
 * @openapi
 * /api/team:
 *   get:
 *     tags: [Team]
 *     summary: Get all team members
 *     description: Retrieve all team members from the database, sorted by creation date (newest first)
 *     responses:
 *       200:
 *         description: Successfully retrieved all team members
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/team:
 *   post:
 *     tags: [Team]
 *     summary: Create a new team member
 *     description: Add a new team member to a project with name, email, and projectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, projectId]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               projectId:
 *                 type: string
 *                 example: "6789xyz789xyz789"
 *     responses:
 *       201:
 *         description: Team member created successfully
 *       400:
 *         description: Bad request - validation error
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/team/{teamId}:
 *   get:
 *     tags: [Team]
 *     summary: Get single team member by ID
 *     description: Retrieve a specific team member's details by their ID
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: The team member ID
 *         example: "6789abc123def456"
 *     responses:
 *       200:
 *         description: Successfully retrieved team member
 *       400:
 *         description: Invalid teamId format
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/team/project/{projectId}:
 *   get:
 *     tags: [Team]
 *     summary: Get all team members of a project
 *     description: Retrieve all team members assigned to a specific project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The project ID
 *         example: "6789xyz789xyz789"
 *     responses:
 *       200:
 *         description: Successfully retrieved team members
 *       400:
 *         description: Invalid projectId format
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/team/{teamId}:
 *   patch:
 *     tags: [Team]
 *     summary: Update a team member
 *     description: Update specific fields of a team member (name, email, or projectId)
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: The team member ID
 *         example: "6789abc123def456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               projectId:
 *                 type: string
 *                 example: "6789xyz789xyz789"
 *     responses:
 *       200:
 *         description: Team member updated successfully
 *       400:
 *         description: Invalid input or email already exists
 *       404:
 *         description: Team member or project not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/team/{teamId}:
 *   delete:
 *     tags: [Team]
 *     summary: Delete a team member
 *     description: Remove a team member from the database
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: The team member ID
 *         example: "6789abc123def456"
 *     responses:
 *       200:
 *         description: Team member deleted successfully
 *       400:
 *         description: Invalid teamId format
 *       404:
 *         description: Team member not found
 *       500:
 *         description: Server error
 */

module.exports = router;