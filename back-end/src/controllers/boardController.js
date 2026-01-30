const Board = require("../models/board");

exports.createBoard = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const board = await Board.create({ name });
  res.status(201).json(board);
};


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

