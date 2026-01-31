const Board = require("../models/board");
const mongoose = require("mongoose");


exports.createBoard = async (req, res) => {
  const { name } = req.body;
  if (!name) 
    return res.status(400).json({ message: "name is required" });

  const board = await Board.create({ name });
  res.status(201).json(board);
};



//patch api 
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

// Make sure the name matches what you use in boardRoutes.js
// get api
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
// get api
exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// delete api
exports.deleteBoard =async(req,res) =>{
  try{
    const {id} =req.params;

  const board=await Board.findByIdAndDelete(id);
  if(!board) return res.status(404).json({message:"Board is not found"});

  res.status(200).json({message:"Board deleted succesfully"});
  }catch(error){
    res.status(400).json({message:"Invalid Board Id"});
  }

};
