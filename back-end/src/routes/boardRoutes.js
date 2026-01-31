
const router = require("express").Router();
const { createBoard,updateBoard } = require("../controllers/boardController");

router.post("/", createBoard); // POST /api/boards
router.patch("/:id", updateBoard); // PATCH /api/boards/:id



const { getAllBoards, getBoardWithDetails } = require("../controllers/boardController");

router.get("/", getAllBoards); // This is likely line 7 where the error is
router.get("/:id", getBoardWithDetails);

module.exports = router;