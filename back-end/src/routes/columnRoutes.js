
const router = require("express").Router();
const { createColumn, updateColumn } = require("../controllers/columnController");

router.post("/boards/:boardId/columns", createColumn);
router.patch("/boards/:boardId/columns/:columnId", updateColumn);


const Column = require("../models/Column");


router.post("/boards/:boardId/columns", createColumn);
router.delete("/columns/:columnId",deleteColumn);

module.exports = router;
