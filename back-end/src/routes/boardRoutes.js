const express = require("express");
const router = express.Router();

const {
  getAllBoards,
  getBoardWithDetails,
  createBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

// GET all boards
router.get("/", getAllBoards);

// GET board full details (if you have it)
router.get("/:boardId", getBoardWithDetails);

// POST create board
router.post("/", createBoard);

// PATCH update board
router.patch("/:boardId", updateBoard);

// DELETE board
router.delete("/:boardId", deleteBoard);

 /*
 * @openapi
 * tags:
 *   - name: Boards
 *     description: Board related APIs
 */


/**
 * @openapi
 * /api/boards:
 *   post:
 *     tags: [Boards]
 *     summary: Create a new board
 *     requestBody:                     # 👈 ADD THIS
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My First Board"
 *     responses:
 *       201:
 *         description: Board created
 */



router.post("/", createBoard); // POST /api/boards

/**
 * @openapi
 * /api/boards/{id}:
 *   patch:
 *     tags: [Boards]
 *     summary: Update board by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:                    # 👈 ADD THIS
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Board Title"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Board updated
 */


router.patch("/:id", updateBoard); // PATCH /api/boards/:id
/**
 * @openapi
 * /api/boards:
 *   get:
 *     tags: [Boards]
 *     summary: Get all boards
 *     responses:
 *       200:
 *         description: Boards list
 */

router.get("/", getAllBoards); // This is likely line 7 where the error is
/**
 * @openapi
 * /api/boards/{id}:
 *   get:
 *     tags: [Boards]
 *     summary: Get board by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board details
 */

router.get("/:id", getBoardWithDetails);   
/**
 * @openapi
 * /api/boards/{id}:
 *   delete:
 *     tags: [Boards]
 *     summary: Delete board by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board deleted
 */
                      
router.delete("/:id",deleteBoard);// delete api routes

module.exports = router;
