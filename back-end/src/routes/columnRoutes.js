const router = require("express").Router();
const { createColumn, updateColumn } = require("../controllers/columnController");

router.post("/boards/:boardId/columns", createColumn);
router.patch("/boards/:boardId/columns/:columnId", updateColumn);

module.exports = router;
