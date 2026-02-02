
const router = require("express").Router();
const { createCard ,updateCard,getAllCards,deleteCard} = require("../controllers/cardController");

router.post("/columns/:columnId/cards", createCard); // POST /api/columns/:columnId/cards
router.patch("/cards/:id",updateCard);
module.exports = router;

const cardController = require("../controllers/cardController");

// Only the GET route
router.get("/", cardController.getAllCards);
// only delete route
router.delete("/cards/:cardId",deleteCard);


module.exports = router;
