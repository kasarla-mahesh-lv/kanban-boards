const Column = require("../models/column");

exports.createColumn = async (req, res) => {
  const { boardId } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const last = await Column.findOne({ boardId }).sort({ order: -1 }).lean();
  const nextOrder = last ? last.order + 1 : 1;

  const column = await Column.create({ boardId, name, order: nextOrder });
  res.status(201).json(column);
};


exports.deleteColumn = async (req,res) => {
  const{columnId} =req.params;
  const column = await column.findByIdAndUpdate(columnId);
  if(!column) 
    return res.status(400).json({message: "column not found"});
  res.status(200).json({message:"column deleted succesfully"});


}
