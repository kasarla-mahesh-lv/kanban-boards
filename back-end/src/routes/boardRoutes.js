const router = require("express").Router();
const { createBoard,updateBoard } = require("../controllers/boardController");

router.post("/", createBoard); // POST /api/boards
router.patch("/:id", updateBoard); // PATCH /api/boards/:id


module.exports = router;
