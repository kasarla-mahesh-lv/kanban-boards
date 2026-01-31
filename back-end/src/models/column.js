const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    name: String,
    boardId: String,
    order: Number,
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Column", columnSchema);
