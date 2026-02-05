const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    // ✅ ADD THIS
    columns: [ String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
