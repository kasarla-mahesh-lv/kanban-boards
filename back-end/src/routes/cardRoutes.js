const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");

// Only the GET route
router.get("/", cardController.getAllCards);

module.exports = router;