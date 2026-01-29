const Board = require("../models/board");

exports.createBoard = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const board = await Board.create({ name });
  res.status(201).json(board);
};
