const router = require("express").Router();
const { createBoard } = require("../controllers/boardController");
const {deleteBoard} = require("../controllers/boardController");

router.post("/", createBoard); // POST /api/boards

router.delete("/:id",deleteBoard);

module.exports = router;
