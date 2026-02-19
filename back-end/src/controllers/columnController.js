const mongoose = require("mongoose");
const Column = require("../models/column");

/* =========================
   GET COLUMNS BY PROJECT
   GET /api/projects/:projectId/columns
========================= */
exports.getColumnsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    const columns = await Column.find({ projectId }).sort({ order: 1 });
    return res.status(200).json(columns);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   CREATE COLUMN (Add Group)
   POST /api/projects/:projectId/columns
   - lowercase store
   - no duplicates (case-insensitive)
========================= */
exports.createColumn = async (req, res) => {
  try {
    const { projectId } = req.params;
    let { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid projectId" });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Column name is required" });
    }

    // ✅ normalize
    name = String(name).trim().toLowerCase();

    // ✅ duplicate check (project + name)
    const exists = await Column.findOne({ projectId, name });
    if (exists) {
      return res.status(409).json({ message: `Column "${name}" already exists` });
    }

    // ✅ Find "done" column
    const doneCol = await Column.findOne({ projectId, name: "done" });

    let nextOrder;

    if (doneCol) {
      // ✅ Shift columns after done to the right
      await Column.updateMany(
        { projectId, order: { $gt: doneCol.order } },
        { $inc: { order: 1 } }
      );

      // ✅ Insert right after done
      nextOrder = doneCol.order + 1;
    } else {
      // fallback: add at end
      const last = await Column.findOne({ projectId }).sort({ order: -1 });
      nextOrder = last ? last.order + 1 : 1;
    }

    const column = await Column.create({
      projectId,
      name,
      order: nextOrder,
      cards: [],
    });

    return res.status(201).json(column);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Column already exists" });
    }
    return res.status(500).json({ message: err.message });
  }
};


/* =========================
   UPDATE COLUMN
   PATCH /api/columns/:columnId
========================= */
exports.updateColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    let { name, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid columnId" });
    }

    const column = await Column.findById(columnId);
    if (!column) return res.status(404).json({ message: "Column not found" });

    const updateData = {};

    if (name !== undefined) {
      name = String(name).trim().toLowerCase();
      if (!name) return res.status(400).json({ message: "Column name cannot be empty" });

      const duplicate = await Column.findOne({
        projectId: column.projectId,
        _id: { $ne: columnId },
        name,
      });

      if (duplicate) {
        return res.status(409).json({ message: `Column "${name}" already exists` });
      }

      updateData.name = name;
    }

    if (order !== undefined) {
      const n = Number(order);
      if (!Number.isFinite(n) || n < 0) {
        return res.status(400).json({ message: "order must be a valid number" });
      }
      updateData.order = n;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updated = await Column.findByIdAndUpdate(
      columnId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Column already exists" });
    }
    return res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE COLUMN
   DELETE /api/columns/:columnId
========================= */
exports.deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid columnId" });
    }

    const deleted = await Column.findByIdAndDelete(columnId);
    if (!deleted) return res.status(404).json({ message: "Column not found" });

    return res.status(200).json({ message: "Column deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
