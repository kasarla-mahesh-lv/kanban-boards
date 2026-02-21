const router = require("express").Router();
const {
  getAllPermissions,
  
} = require("../controllers/permissionController");


/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permission management
 */

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     description: Fetch all permissions from database
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Permissions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permissions fetched successfully
 *                 count:
 *                   type: number
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65a1f9b2e12c9c00123abcd
 *                       name:
 *                         type: string
 *                         example: Create Board
 *                       code:
 *                         type: string
 *                         example: BOARD_CREATE
 *                       description:
 *                         type: string
 *                         example: Permission to create board
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Server error
 */
router.get("/", getAllPermissions);

module.exports = router;

