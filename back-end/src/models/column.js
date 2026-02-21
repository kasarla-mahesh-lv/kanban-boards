const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Projects", required: true },

    // ✅ always store lowercase
    name: { type: String, required: true, trim: true, lowercase: true },

    order: { type: Number, default: 1 },
    cards: { type: Array, default: [] },
  },
  { timestamps: true }
);

// ✅ no duplicates in same project (done == DONE blocked)
columnSchema.index({ projectId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Column", columnSchema);
