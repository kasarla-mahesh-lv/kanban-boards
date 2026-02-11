const ColumnModel = require("../models/column");
const Column = require("../models/column");

// ✅ Create Column
exports.createColumn = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Column name required" });
    }

    const column = await Column.create({
      boardId: projectId,
      name: name,
      order: 1,
      cards: []
    });

    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ Update Column
exports.updateColumn = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;
    const { name, order } = req.body;

    if (name === undefined && order === undefined) {
      return res.status(400).json({ message: "Provide name or order to update" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (order !== undefined) updateData.order = order;

    const updated = await ColumnModel.findOneAndUpdate(
      { _id: columnId, boardId },
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

// ✅ GET Columns by Board (FIX for your undefined error)
exports.getColumnsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = await ColumnModel.find({ boardId }).sort({ order: 1 });
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch columns", error: error.message });
  }
};

// ✅ GET All Columns (Optional)
exports.getAllColumns = async (req, res) => {
  try {
    const columns = await ColumnModel.find();
    res.status(200).json(columns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all columns", error: error.message });
  }
};

// ✅ Delete Column (boardId check added)
exports.deleteColumn = async (req, res) => {
  try {
    const { boardId, columnId } = req.params;

    const deleted = await ColumnModel.findOneAndDelete({ _id: columnId, boardId });

    if (!deleted) {
      return res.status(404).json({ message: "Column not found for this board" });
    }

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid column id" });
  }
};
