const router = require("express").Router();
const { createBoard } = require("../controllers/boardController");
const {deleteBoard} = require("../controllers/boardController");

router.post("/", createBoard);
router.delete("/:id",deleteBoard);

module.exports = router;
