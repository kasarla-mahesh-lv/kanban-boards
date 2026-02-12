const mongoose = require("mongoose");
const Column = require("../models/column");

// ✅ Create Column (Add Group)
exports.createColumn = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Column name required" });
    }

    // ✅ next order (last order + 1)
    const last = await Column.findOne({ boardId: projectId }).sort({ order: -1 });
    const nextOrder = last ? last.order + 1 : 1;

    const column = await Column.create({
      boardId: projectId,
      name: name.trim(),
      order: nextOrder,
      cards: [],
    });

    return res.status(201).json(column);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ✅ Update Column (name/order)
exports.updateColumn = async (req, res) => {
  try {
    const { projectId, columnId } = req.params;
    const { name, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid columnId" });
    }

    if (name === undefined && order === undefined) {
      return res.status(400).json({ message: "Provide name or order to update" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (order !== undefined) updateData.order = order;

    // ✅ make sure column belongs to this project
    const updated = await Column.findOneAndUpdate(
      { _id: columnId, boardId: projectId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Column not found for this project" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// ✅ Get columns by projectId
exports.getColumnsByBoard = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const columns = await Column.find({ boardId: projectId }).sort({ order: 1 });
    return res.status(200).json(columns);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch columns", error: error.message });
  }
};

// ✅ Delete Column
exports.deleteColumn = async (req, res) => {
  try {
    const { projectId, columnId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid columnId" });
    }

    const deleted = await Column.findOneAndDelete({
      _id: columnId,
      boardId: projectId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Column not found for this project" });
    }

    return res.status(200).json({ message: "Column deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
