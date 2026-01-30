const express = require("express");
const router = express.Router();
const { getAllBoards, getBoardWithDetails } = require("../controllers/boardController");

router.get("/", getAllBoards); // This is likely line 7 where the error is
router.get("/:id", getBoardWithDetails);

module.exports = router;