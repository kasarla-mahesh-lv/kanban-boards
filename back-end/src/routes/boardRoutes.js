const router = require("express").Router();
const { createBoard } = require("../controllers/boardController");

router.post("/", createBoard); // POST /api/boards

module.exports = router;
