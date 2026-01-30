const router = require("express").Router();
const { createColumn } = require("../controllers/columnController");
const {deleteColumn}=require("../controllers/columnController");


router.post("/boards/:boardId/columns", createColumn);
router.delete("/columns/:columnId",deleteColumn);


module.exports = router;
