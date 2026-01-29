const router = require("express").Router();
const { createCard } = require("../controllers/cardController");

router.post("/columns/:columnId/cards", createCard); // POST /api/columns/:columnId/cards

module.exports = router;
