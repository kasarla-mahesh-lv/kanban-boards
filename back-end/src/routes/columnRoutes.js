const router = require("express").Router();
const { createColumn } = require("../controllers/columnController");
const {deleteColumn}=require("../controllers/columnController");

router.post("/boards/:boardId/columns", createColumn); // POST /api/boards/:boardId/columns

router.delete("/columns/:boardId",deleteColumn);


module.exports = router;
