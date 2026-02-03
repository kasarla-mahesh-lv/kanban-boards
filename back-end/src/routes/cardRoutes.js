
const router = require("express").Router();
//const {cardController}=require("../controllers/cardController");
const { createCard ,updateCard,deleteCard,getAllCards} = require("../controllers/cardController");

router.post("/columns/:columnId/cards", createCard); // POST /api/columns/:columnId/cards
router.patch("/cards/:id",updateCard);

// Only the GET route
router.get("/",getAllCards);
// only delete route
router.delete("/:cardId",deleteCard);


module.exports = router;
