/**
 * @openapi
 * tags:
 *   - name: Cards
 *     description: Card related APIs
 */

const router = require("express").Router();
const { createCard ,updateCard,getAllCards,deleteCard} = require("../controllers/cardController");

const {
  createCard,
  updateCard,
  getAllCards,
  deleteCard,
} = require("../controllers/cardController");

/**
 * @openapi
 * /api/cards/columns/{columnId}/cards:
 *   post:
 *     tags: [Cards]
 *     summary: Create a card in a column
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *         description: Column ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My first card"
 *               description:
 *                 type: string
 *                 example: "Some details"
 *     responses:
 *       201:
 *         description: Card created
 *       400:
 *         description: Title is required
 *       404:
 *         description: Column not found
 */
router.post("/columns/:columnID/cards",createCard);

/**
 * @openapi
 * /api/cards/cards/{id}:
 *   patch:
 *     tags: [Cards]
 *     summary: Update a card title
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated card title"
 *     responses:
 *       200:
 *         description: Card updated
 *       404:
 *         description: Card not found
 */
router.patch("/cards/:id", updateCard);

/**
 * @openapi
 * /api/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards
 *     responses:
 *       200:
 *         description: Cards list
 */
router.get("/", getAllCards);

/**
 * @openapi
 * /api/cards/cards/{cardId}:
 *   delete:
 *     tags: [Cards]
 *     summary: Delete a card by id
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted
 *       404:
 *         description: Card not found
 */
router.delete("/cards/:cardId", deleteCard);

module.exports = router;
