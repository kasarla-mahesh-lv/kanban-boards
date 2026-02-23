const router = require("express").Router();
const { getAllRoles } = require("../controllers/roleController");

/**
 * @openapi
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles with permissions
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get("/", getAllRoles);

module.exports = router;