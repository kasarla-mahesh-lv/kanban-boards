const express = require("express");
const router = express.Router();

const {
  createCard,
  updateCard,
  deleteCard,
  getCardsByColumn,
} = require("../controllers/cardController");

/**
 * @openapi
 * tags:
 *   - name: Cards
 *     description: Card related APIs
 */

/**
 * @openapi
 * /api/cards/columns/{columnId}/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards in a column
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cards list
 */
router.get("/columns/:columnId/cards", getCardsByColumn);

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
 *                 example: "Implement login"
 *               description:
 *                 type: string
 *                 example: "Add JWT auth"
 *     responses:
 *       201:
 *         description: Card created
 */
router.post("/columns/:columnId/cards", createCard);

/**
 * @openapi
 * /api/cards/columns/{columnId}/cards/{cardId}:
 *   patch:
 *     tags: [Cards]
 *     summary: Update a card
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card updated
 */
router.patch("/columns/:columnId/cards/:cardId", updateCard);

/**
 * @openapi
 * /api/cards/columns/{columnId}/cards/{cardId}:
 *   delete:
 *     tags: [Cards]
 *     summary: Delete a card
 *     parameters:
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card deleted
 */
router.delete("/columns/:columnId/cards/:cardId", deleteCard);

module.exports = router;
