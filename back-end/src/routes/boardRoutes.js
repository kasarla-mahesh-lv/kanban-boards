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

module.exports = router;
