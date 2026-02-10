const mongoose = require("mongoose");
const CardModel= require("../models/card");
const ColumnModel = require("../models/column")
const logHistory = require("../utils/historyLogger");


exports.createCard = async (req, res) => {
  const { columnId } = req.params;
  console.log(req.params)
  const { title, description = "" } = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  const column = await ColumnModel.findById(columnId).lean();
  if (!column) return res.status(404).json({ message: "Column not found" });

  const last = await CardModel.findOne({ columnId }).sort({ order: -1 }).lean();
  const nextOrder = last ? last.order + 1 : 1;

  const card = await CardModel.create({
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

    const updatedCard = await CardModel.findByIdAndUpdate(
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
    const cards = await CardModel.find(); // specific command to find data
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// delete api
exports.deleteCard = async(req,res) => {
 try{
  const{cardId} =req.params;

  const card=await CardModel.findByIdAndDelete(cardId);
  if(!card)
    return res.status(404).json({message:"card not found"});
  res.status(200).json({message:"card deleted succesfully"});
 } catch(error){
  return res.status(400).json({message:"Invalid Card Id"});
 }
};

// ✅ MOVE CARD (Drag & Drop) - works with STRING columnId & boardId
// PATCH /api/cards/:id/move
exports.moveCard = async (req, res) => {
  try {
    const { id } = req.params; // card id (string)
    const { toColumnId, sourceCards = [], destCards = [] } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Card id is required" });
    }

    if (!toColumnId) {
      return res.status(400).json({ message: "toColumnId is required" });
    }
    const existingCard=await CardModel.findById(id);
    const oldColumn=existingCard?.columnId;

    // 1️⃣ move card to new column
    const movedCard = await CardModel.findByIdAndUpdate(
      id,
      { columnId: toColumnId },
      { new: true }
    );

    if (!movedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    // ⭐ Save history after moving
  await logHistory({
    actionType: "moved task",
    taskTitle: movedCard.title,
    taskId: movedCard._id,
    boardId: movedCard.boardId,
    fromColumn: oldColumn,
    toColumn: toColumnId
  });


    // helper function to update orders
    const updateOrders = async (cards) => {
      if (!Array.isArray(cards)) return;

      for (const c of cards) {
        await CardModel.findByIdAndUpdate(c._id, {
          order: c.order
        });
      }
    };

    // 2️⃣ reorder cards in source column
    await updateOrders(sourceCards);

    // 3️⃣ reorder cards in destination column
    await updateOrders(destCards);

    res.status(200).json({
      message: "Card moved successfully",
      card: movedCard
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

