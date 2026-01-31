const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    order: Number,
    columnId: String,
    boardId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
