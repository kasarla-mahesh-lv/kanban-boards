const Board = require("../models/board");
const mongoose = require("mongoose");

exports.createBoard = async (req, res) => {
  const { name } = req.body;
  if (!name) 
    return res.status(400).json({ message: "name is required" });

  const board = await Board.create({ name });
  res.status(201).json(board);
};




exports.updateBoard = async (req, res) => {
  try {
    const { id } = req.params;     // URL lo /:id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board id" });
    }
    const { name } = req.body;     // body lo name

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

