const router = require("express").Router();
const { createCard } = require("../controllers/cardController");
const {deleteCard} =require("../controllers/cardController");

router.post("/columns/:columnId/cards",createCard);
router.delete("/cards/:cardId",deleteCard);

module.exports = router;
