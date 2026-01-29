const router = require("express").Router();
const { createColumn } = require("../controllers/columnController");

router.post("/boards/:boardId/columns", createColumn); // POST /api/boards/:boardId/columns

module.exports = router;
