const Board = require("../models/board");

// Make sure the name matches what you use in boardRoutes.js
exports.getBoardWithDetails = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate({
            path: 'columns',
            populate: { path: 'cards' }
        });
        if (!board) return res.status(404).json({ message: "Board not found" });
        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a generic get all boards function if you need it
exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};