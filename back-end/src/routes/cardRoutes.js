const express = require("express");
const router = express.Router();
const { createCard, getCardsByColumnId } = require("../controllers/cardController");

router.post("/", createCard);
router.get("/column/:columnId", getCardsByColumnId);

module.exports = router;