const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    order: { type: Number, required: true }
  },
  { timestamps: true }
);

cardSchema.index({ columnId: 1, order: 1 });
module.exports = mongoose.model("Card", cardSchema);
