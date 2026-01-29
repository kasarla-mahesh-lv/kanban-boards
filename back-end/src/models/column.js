const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    name: { type: String, required: true, trim: true },
    order: { type: Number, required: true }
  },
  { timestamps: true }
);

columnSchema.index({ boardId: 1, order: 1 });
module.exports = mongoose.model("Column", columnSchema);
