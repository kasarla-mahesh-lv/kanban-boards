const router = require("express").Router();
const { getAllRoles, deleteRolePermissions } = require("../controllers/roleController");
const { createRole, updateRole,deleteRole,updateRolePermissions,updateUserRole } = require("../controllers/roleController");
const authMiddleware = require("../middlewares/authmiddlewares");
const permissionGate = require("../middlewares/permissionGate");

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
router.get("/",authMiddleware,permissionGate("VIEW_ROLE"), getAllRoles);


/**
 * @openapi
 * /api/roles/create:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Create a new role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: manager
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 65fa123abc
 *                   - 65fa456def
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Validation error
 */
router.post("/create",authMiddleware,permissionGate("CREATE_ROLE"), createRole);


/**
 * @openapi
 * /api/roles/update/{roleId}:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Update role 
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6999713920a897e1fb1a97ba
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: senior developer
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 65fa123abc
 *                   - 65fa456def
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 */
router.put("/update/:roleId",authMiddleware,permissionGate("UPDATE_ROLE"), updateRole);


/**
 * @openapi
 * /api/roles/delete/{roleId}:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: Delete role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6999713920a897e1fb1a97ba
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
router.delete("/delete/:roleId",authMiddleware,permissionGate("DELETE_ROLE"), deleteRole);


/**
 * @openapi
 * /api/roles/updateRolePermissions:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Update role permissions
 *     description: Update permissionIds for a specific role (RBAC)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissionIds
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: 699ebf3a09608be50d9da5ae
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 699d30a43dc0d4627e6ef421
 *                   - 699d45858180160e085bfda4
 *     responses:
 *       200:
 *         description: Role permissions updated successfully
 *       404:
 *         description: Role not found
 *       403:
 *         description: Access Denied
 *       500:
 *         description: Server error
 */
router.put("/updateRolePermissions",authMiddleware,permissionGate("UPDATE_ROLEPERMISSIONS"),updateRolePermissions);

/**
 * @openapi
 * /api/roles/deleteRolePermissions:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Delete role permissions
 *     description: Delete permissionIds for a specific role (RBAC)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissionIds
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: 699ebf3a09608be50d9da5ae
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - 699d30a43dc0d4627e6ef421
 *                   - 699d45858180160e085bfda4
 *     responses:
 *       200:
 *         description: Role permissions deleted successfully
 *       404:
 *         description: Role not found
 *       403:
 *         description: Access Denied
 *       500:
 *         description: Server error
 */
router.put("/deleteRolePermissions",authMiddleware,permissionGate("DELETE_ROLEPERMISSIONS"),deleteRolePermissions);



/**
 * @openapi
 * /api/roles/updateUser:
 *   put:
 *     tags:
 *       - Roles
 *     summary: update role to user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 65fa999abc
 *               roleId:
 *                 type: string
 *                 example: 65fa123abc
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User or Role not found
 */
router.put("/updateUser",authMiddleware,permissionGate("UPDATE_USERROLE"), updateUserRole);

module.exports = router;