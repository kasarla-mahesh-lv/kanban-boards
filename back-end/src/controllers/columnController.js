const Column = require("../models/Column");

exports.createColumn = async (req, res) => {
  const { boardId } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const last = await Column.findOne({ boardId }).sort({ order: -1 }).lean();
  const nextOrder = last ? last.order + 1 : 1;

  const column = await Column.create({ boardId, name, order: nextOrder });
  res.status(201).json(column);
};

exports.updateColumn = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { name, order } = req.body;

    // At least one field must be provided
    if (name === undefined && order === undefined) {
      return res.status(400).json({ message: "Provide name or order to update" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (order !== undefined) updateData.order = order;

    // boardId check + columnId match
    const updated = await Column.findOneAndUpdate(
      { _id: columnId, boardId: boardId },
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Column not found for this board" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// MUST have 'exports.' before the function name
exports.getAllColumns = async (req, res) => { 
    try {
        const columns = await Column.find().populate('cards');
        res.status(200).json(columns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// delete api 
exports.deleteColumn = async (req,res) => {
  try {
    const { columnId } = req.params;

    const column = await Column.findByIdAndDelete(columnId);

    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid column id" });
  }
};

