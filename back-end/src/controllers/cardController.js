const Card = require("../models/card");

exports.createCard = async (req, res) => {
  const { columnId } = req.params;
  const { title} = req.body;
  if (!title) return res.status(400).json({ message: "title is required" });

  const column = await Column.findById(columnId).lean();
  if (!column) return res.status(404).json({ message: "Column not found" });

  const last = await Card.findOne({ columnId }).sort({ order: -1 }).lean();
  const nextOrder = last ? last.order + 1 : 1;

  const card = await Card.create({
    boardId: column.boardId,
    columnId,
    title,
    order: nextOrder
  });

  res.status(201).json(card);
};


exports.deleteCard = async(req,res) => {
 try{
  const{cardId} =req.params;

  const card=await Card.findByIdAndDelete(cardId);
  if(!card)
    return res.status(404).json({message:"card not found"});
  res.status(200).json({message:"card deleted succesfully"});
 } catch(error){
  return res.status(400).json({message:"Invalid Card Id"});
 }
};



