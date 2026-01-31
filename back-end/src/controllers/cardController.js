const mongoose = require("mongoose");
const Card = require("../models/card");



exports.createCard = async (req, res) => {
  const { columnId } = req.params;
  const { title, description = "" } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  const column = await Column.findById(columnId).lean();
  if (!column) return res.status(404).json({ message: "Column not found" });

  const last = await Card.findOne({ columnId }).sort({ order: -1 }).lean();
  const nextOrder = last ? last.order + 1 : 1;

  const card = await Card.create({
    boardId: column.boardId,
    columnId,
    title,
    description,
    order: nextOrder
  });

  res.status(201).json(card);
};
// PATCH - update card (title/description)
exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // validate card id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid card id" });
    }

    // at least one field must be present
    if (!title && !description) {
      return res.status(400).json({ message: "title or description is required" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: req.body }, // updates given fields only
      { new: true, runValidators: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ONLY: Fetch all cards from the database
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find(); // specific command to find data
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
